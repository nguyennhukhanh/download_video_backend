# Download Video Backend

This is a backend server for downloading videos from various social media platforms.

## Installation

1. Clone the repository: `git clone https://github.com/yourusername/download_video_backend.git`
2. Install the dependencies: `npm install`
3. Start the server: `npm start`

## Usage

The server listens on port 3000 and supports the following endpoints:

- `/api/v1/download?url={videoUrl}`: Downloads a video from the specified URL and returns the result.
- `/health`: Returns a health check status.
- `/*`: Returns a 404 error if the requested endpoint is not found.

Example request to download a YouTube video:

```http
GET /api/v1/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ HTTP/1.1
Host: localhost:3000

Example response:
{
  "message": "Success",
  "data": {
    "social": "youtube",
    "title": "Rick Astley - Never Gonna Give You Up (Video)",
    "avatar": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
    "noWatermarkMp4": "https://www.youtube.com/embed/dQw4w9WgXcQ?&mute=1&controls=0&start=0&end=0&autoplay=1&enablejsapi=1&origin=http%3A%2F%2Flocalhost%3A3000",
    "watermarkMp4": "https://www.youtube.com/embed/dQw4w9WgXcQ?&mute=1&controls=0&start=0&end=0&autoplay=1&enablejsapi=1&origin=http%3A%2F%2Flocalhost%3A3000",
    "cover": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg"
  }
}
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.
