const express = require("express");
const downloader = require("rahad-media-downloader");
const cors = require("cors");
const helmet = require("helmet");
const schedule = require("./cron");

const app = express();
app.use(
  cors({
    origin: "https://stream-saver-front-end.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());

const apiPrefix = "/api/v1";
const port = 3000;

app.get(apiPrefix + "/download", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).send({ message: "Failed", data: "Invalid URL" });
    }

    let type = "";
    let response = "";
    let result = {};

    if (/^https:\/\/www\.tiktok\.com\/@[\w\.]+\/video\/\d+/.test(url)) {
      type = "tiktok";
    } else if (
      /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/.test(url) ||
      /^https:\/\/youtu\.be\/[\w-]+/.test(url)
    ) {
      type = "youtube";
    } else if (/^https:\/\/www\.facebook\.com\/share\/v\/[\w-]+/.test(url)) {
      type = "facebook";
    } else if (/^https:\/\/www\.instagram\.com\/reel\/[\w-]+/.test(url)) {
      type = "instagram";
    } else {
      type = "unknown";
    }

    switch (type) {
      case "tiktok":
        response = await downloader.rahadtikdl(url);
        result = {
          social: "tiktok",
          title: response.data.title,
          noWatermarkMp4: response.data.noWatermarkMp4,
          watermarkMp4: response.data.watermarkMp4,
          avatar: response.data.avatar,
          cover: response.data.cover,
        };
        break;
      case "youtube":
        response = await downloader.rahadytdl(url);
        result = {
          social: "youtube",
          title: response.info.title,
          avatar: response.info.channelAvatar,
          noWatermarkMp4: response.info.videoLinks.medium,
          watermarkMp4: response.info.videoLinks.medium,
          cover: response.info.thumbnailUrl,
        };
        break;
      case "facebook":
        response = await downloader.rahadfbdl(url);
        result = {
          social: "facebook",
          title: response.data.title,
          sd: response.data.sd,
          hd: response.data.hd,
          thumbnail: response.data.thumbnail,
        };
        break;
      case "instagram":
        response = await downloader.rahadinsta(url);
        result = {
          social: "instagram",
          title: response.data.owner.username,
          avatar: response.data.owner.profile_pic_url,
          noWatermarkMp4: response.data.video_url,
          watermarkMp4: response.data.video_url,
          cover: response.data.thumbnail_src,
        };
        break;
      default:
        result = {
          message: "Failed",
          data: "Failed to download video!",
        };
        break;
    }

    if (result.message === "Failed") {
      return res.status(400).send({ message: "Failed", data: result.data });
    }

    return res.send({ message: "Success", data: result });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Failed", data: "Failed to download video!" });
  }
});

app.get("/health", (req, res) => {
  return res
    .status(200)
    .send({ message: "Success", data: `Server is running!` });
});

app.get("*", (req, res) => {
  return res.status(404).send({ message: "Failed", data: "Not found" });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
schedule();
