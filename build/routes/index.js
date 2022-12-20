"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const index_1 = __importDefault(require("../controllers/index"));
const videosPath = `${__dirname}/../../assets/videos`;
const router = express_1.default.Router();
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
router.post("/videos/upload", upload.single("video"), index_1.default.uploadVideo);
router.get("/videos/metadata", index_1.default.getVideoMetaData);
router.get("/videos/:id/metadata", index_1.default.getVideoMetaDataById);
exports.default = router;
