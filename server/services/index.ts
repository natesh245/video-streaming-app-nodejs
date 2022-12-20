import { promises as fs } from "fs";

const videoDataPath = `${__dirname}/../../data/videos.json`;

const readVideosMetaData = async () => {
  try {
    const data = await fs.readFile(videoDataPath);
    const videos = JSON.parse(data.toString());
    return videos;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const insertVideoMetaData = async (videoMetaData: any) => {
  try {
    const videos = await readVideosMetaData();

    videos.push(videoMetaData);
    await fs.writeFile(videoDataPath, JSON.stringify(videos));
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const fetchVideoMetaDataById = async (id: string) => {
  try {
    const data = await fs.readFile(videoDataPath);
    const videos = JSON.parse(data.toString());
    const video = videos.find((video: any) => video.id === id);
    return video;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const services = {
  readVideosMetaData,
  insertVideoMetaData,
  fetchVideoMetaDataById,
};

export default services;
