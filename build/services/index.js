"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const videoDataPath = `${__dirname}/../../data/videos.json`;
const readVideosMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fs_1.promises.readFile(videoDataPath);
        const videos = JSON.parse(data.toString());
        return videos;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
const insertVideoMetaData = (videoMetaData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield readVideosMetaData();
        videos.push(videoMetaData);
        yield fs_1.promises.writeFile(videoDataPath, JSON.stringify(videos));
        return true;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
const fetchVideoMetaDataById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fs_1.promises.readFile(videoDataPath);
        const videos = JSON.parse(data.toString());
        const video = videos.find((video) => video.id === id);
        return video;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
const services = {
    readVideosMetaData,
    insertVideoMetaData,
    fetchVideoMetaDataById,
};
exports.default = services;
