import express, { Express } from "express";
import videoRoutes from "./routes/index";

const PORT: number = 4000;

const app: Express = express();

app.use(videoRoutes);

app.listen(PORT, () => {
  console.log("Listening on port" + PORT);
});
