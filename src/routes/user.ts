import { Router } from "express";
import { User } from "../db";
import { MongooseError } from "mongoose";
import bcrypt from "bcrypt";
import { validate } from "../middlewares/validate";
import { userSchema } from "../schemas/user";
import jwt from "jsonwebtoken";

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
        msg: (err as Error).message,
        errorStack: (err as Error).stack,
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
  if (!user) {
    res.status(400).json({
      msg: "Incorrect username",
    });
    return;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password ?? "");
  if (isPasswordMatch) {
    const token = jwt.sign(
      {
        id: user._id,
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
