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

app.get("/videos/:id", (req: Request, res: Response) => {
  const id: string = req.params.id;
  fs.readFile(videoDataPath, (err, data) => {
    if (err) return res.status(500).send("Internal Server error");
    const videos = JSON.parse(data.toString());
    const video = videos.find((video: any) => video.id === id);
    res.status(200).json(video);
  });
});

app.listen(PORT, () => {
  console.log("Listening on port" + PORT);
});
