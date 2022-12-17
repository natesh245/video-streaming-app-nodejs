import express, { Request, Response, Express } from "express";
import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const PORT: number = 4000;
const videosPath = `${__dirname}/../assets/videos`;
const videoDataPath = `${__dirname}/../data/videos.json`;

const app: Express = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videosPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".mp4");
  },
});
const upload: multer.Multer = multer({ storage });

app.post(
  "/videos/upload",
  upload.single("video"),
  (req: Request, res: Response) => {
    const file: Express.Multer.File = req.file!;
    if (!file)
      return res.status(400).send("Bad Request: Video File is madatory");

    if (file.mimetype != "video/mp4")
      return res.status(400).send("Expecting video in mp4 format");
    const id: string = uuidv4();

    const videoMetaData = {
      id,
      ...file,
    };
    fs.readFile(videoDataPath, (err, videojsonbuffer) => {
      if (err) return res.status(500).send(err);
      const videoJSON = videojsonbuffer.toString();
      const videos = JSON.parse(videoJSON);
      console.log(videos);
      videos.push(videoMetaData);
      fs.writeFile(
        `${__dirname}/../data/videos.json`,
        JSON.stringify(videos),
        (err) => {
          if (err) return res.status(500).send(err);
        }
      );
    });
    return res.status(200).send("Video uploaded successfully");
  }
);

app.get("/videos", (req: Request, res: Response) => {
  fs.readFile(videoDataPath, (err, data) => {
    if (err) return res.status(500).send("Internal server error");
    const videos = JSON.parse(data.toString());
    res.status(200).json(videos);
  });
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
    __dirname + "/../assets/videos/pexels-olya-kobruseva-8943204.mp4";
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
