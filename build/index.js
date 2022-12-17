"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const PORT = 4000;
const app = (0, express_1.default)();
app.get("/hello", (req, res) => {
    res.send("Hello");
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
    const videoPath = __dirname + "/../assets/videos/pexels-ana-benet-8242842.mp4";
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
