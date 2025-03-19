import express from "express";
import { userRouter } from "./routes/user";
const app = express();

app.use(express.json()); // to be able to parse body in post requests
app.use("/api/v1/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
