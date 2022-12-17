import express, { Request, Response, Express } from "express";
import fs from "fs";
const PORT: number = 4000;

const app: Express = express();

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("/page", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req: Request, res: Response) => {
  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Range header is required");
  }
  console.log(range);
  const videoPath =
    __dirname + "/../assets/videos/pexels-ana-benet-8242842.mp4";
  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(PORT, () => {
  console.log("Listening on port" + PORT);
});
