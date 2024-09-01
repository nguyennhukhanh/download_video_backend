const axios = require("axios");
const cron = require("node-cron");

function schedule() {
  cron.schedule("* * * * *", async () => {
    console.log("Task running...", new Date());
    try {
      const response = await axios.get(
        "https://download-video-backend.onrender.com/health"
      );
      console.log("API response:", response.data);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  });
}

module.exports = schedule;
