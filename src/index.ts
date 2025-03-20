import express from "express";
import { userRouter } from "./routes/user";
import { auth } from "./middlewares/auth";
import { contentRouter } from "./routes/content";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
mongoose.connect(process.env.MONGO_URL ?? "");
const app = express();

app.use(express.json()); // to be able to parse body in post requests
app.use("/api/v1/user", userRouter);
app.use(auth);
app.use("/api/v1/content", contentRouter);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
