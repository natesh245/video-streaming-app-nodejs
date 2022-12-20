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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const index_1 = __importDefault(require("../services/index"));
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).send("Bad Request: Video File is madatory");
        if (file.mimetype != "video/mp4")
            return res.status(400).send("Expecting video in mp4 format");
        const id = (0, uuid_1.v4)();
        const videoMetaData = Object.assign({ id }, file);
        const isDone = yield index_1.default.insertVideoMetaData(videoMetaData);
        return res.status(200).json({
            data: videoMetaData,
            message: "Video uploaded successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            data: err,
            message: "Internal server error: something went wrong",
        });
    }
});
const getVideoMetaData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videosMetadata = yield index_1.default.readVideosMetaData();
        return res.status(200).json({
            data: videosMetadata,
            message: "Successfully fetched videos metadata",
        });
    }
    catch (error) {
        res.status(500).json({
            data: error,
            message: "Internal server error, Something wen twrong",
        });
    }
});
const getVideoMetaDataById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const video = yield index_1.default.fetchVideoMetaDataById(id);
        return res.status(200).json({
            data: video,
            message: "Successfully fetched video metadata",
        });
    }
    catch (err) {
        res.status(500).json({
            data: err,
            message: "Internal server error, Something went wrong",
        });
    }
});
const controllers = { uploadVideo, getVideoMetaData, getVideoMetaDataById };
exports.default = controllers;
