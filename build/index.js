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
const videosPath = `${__dirname}/../assets/videos`;
const videoDataPath = `${__dirname}/../data/videos.json`;
const app = (0, express_1.default)();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, videosPath);
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
    fs_1.default.readFile(videoDataPath, (err, videojsonbuffer) => {
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
app.get("/videos", (req, res) => {
    fs_1.default.readFile(videoDataPath, (err, data) => {
        if (err)
            return res.status(500).send("Internal server error");
        const videos = JSON.parse(data.toString());
        res.status(200).json(videos);
    });
});
app.get("/videos/:id", (req, res) => {
    const id = req.params.id;
    fs_1.default.readFile(videoDataPath, (err, data) => {
        if (err)
            return res.status(500).send("Internal Server error");
        const videos = JSON.parse(data.toString());
        const video = videos.find((video) => video.id === id);
        res.status(200).json(video);
    });
});
app.listen(PORT, () => {
    console.log("Listening on port" + PORT);
});
