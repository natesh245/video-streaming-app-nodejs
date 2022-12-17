"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const PORT = 4000;
const app = (0, express_1.default)();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../assets/videos`);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".mp4");
    },
});
const upload = (0, multer_1.default)({ storage });
app.post("/videos/upload", upload.single("video"), (req, res) => {
    const file = req.file;
    if (!file)
        return res.status(400).send("Bad Request: Video File is madatory");
    if (file.mimetype != "video/mp4")
        return res.status(400).send("Expecting video in mp4 format");
    const id = (0, uuid_1.v4)();
    const videoMetaData = Object.assign({ id }, file);
    fs_1.default.readFile(`${__dirname}/../data/videos.json`, (err, videojsonbuffer) => {
        if (err)
            return res.status(500).send(err);
        const videoJSON = videojsonbuffer.toString();
        const videos = JSON.parse(videoJSON);
        console.log(videos);
        videos.push(videoMetaData);
        fs_1.default.writeFile(`${__dirname}/../data/videos.json`, JSON.stringify(videos), (err) => {
            if (err)
                return res.status(500).send(err);
        });
    });
    return res.status(200).send("Video uploaded successfully");
});
app.get("/page", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/video", (req, res) => {
    const range = req.headers.range;
    if (!range) {
        return res.status(400).send("Range header is required");
    }
    console.log(range);
    const videoPath = __dirname + "/../assets/videos/pexels-olya-kobruseva-8943204.mp4";
    const videoSize = fs_1.default.statSync(videoPath).size;
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
    const videoStream = fs_1.default.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});
app.listen(PORT, () => {
    console.log("Listening on port" + PORT);
});
