import express from "express";
import { userRouter } from "./routes/user";
import { contentRouter } from "./routes/content";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { brainRouter } from "./routes/brain";
import cors from "cors";
import { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();
mongoose.connect(process.env.MONGO_URL ?? "");
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json()); // to be able to parse body in post requests
app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", brainRouter);

app.get("/", (_, res) => {
  res.json({
    Status: "running",
  });
});

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
