import express, { Router, Request, Response } from "express";

import multer from "multer";

import videoControllers from "../controllers/index";

const videosPath = `${__dirname}/../../assets/videos`;

const router: Router = express.Router();
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

router.post(
  "/videos/upload",
  upload.single("video"),
  videoControllers.uploadVideo
);

router.get("/videos/metadata", videoControllers.getVideoMetaData);

router.get("/videos/:id/metadata", videoControllers.getVideoMetaDataById);

export default router;
