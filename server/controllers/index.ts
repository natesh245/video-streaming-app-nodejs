import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import videoService from "../services/index";

const uploadVideo = async (req: Request, res: Response) => {
  try {
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

    const isDone = await videoService.insertVideoMetaData(videoMetaData);

    return res.status(200).json({
      data: videoMetaData,
      message: "Video uploaded successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      data: err,
      message: "Internal server error: something went wrong",
    });
  }
};

const getVideoMetaData = async (req: Request, res: Response) => {
  try {
    const videosMetadata = await videoService.readVideosMetaData();
    return res.status(200).json({
      data: videosMetadata,
      message: "Successfully fetched videos metadata",
    });
  } catch (error) {
    res.status(500).json({
      data: error,
      message: "Internal server error, Something wen twrong",
    });
  }
};

const getVideoMetaDataById = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const video = await videoService.fetchVideoMetaDataById(id);
    return res.status(200).json({
      data: video,
      message: "Successfully fetched video metadata",
    });
  } catch (err) {
    res.status(500).json({
      data: err,
      message: "Internal server error, Something went wrong",
    });
  }
};

const controllers = { uploadVideo, getVideoMetaData, getVideoMetaDataById };

export default controllers;
