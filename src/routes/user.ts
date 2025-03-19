import { Router } from "express";
import { User } from "../db";
import mongoose, { MongooseError } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { validate } from "../middlewares/validate";
import { userSchema } from "../schemas/user";
import jwt from "jsonwebtoken";

dotenv.config();
mongoose.connect(process.env.MONGO_URL ?? "");

export const userRouter = Router();

userRouter.post("/signup", validate(userSchema), async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: username,
      password: hashedPassword,
    });
    res.json({
      msg: "User signed up successfully",
    });
  } catch (err) {
    if (err instanceof MongooseError) {
      res.status(411).json({
        error: err.message,
      });
    } else {
      res.status(500).json({
        error: "Server Error",
      });
    }
  }
  return;
});

userRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    username: username,
  });
  const isPasswordMatch = await bcrypt.compare(password, user?.password ?? "");
  if (isPasswordMatch) {
    const token = jwt.sign(
      {
        username: username,
      },
      process.env.JWT_SECRET ?? ""
    );
    res.json({
      msg: "Signed in successfully",
      token: token,
    });
  } else {
    res.json({
      msg: "Invalid credentials",
    });
  }
});
