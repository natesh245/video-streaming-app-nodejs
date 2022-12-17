import express, { Request, Response, Application } from "express";
const PORT: number = 4000;

const app: Application = express();

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log("Listening on port" + PORT);
});
