import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const [_, token]: string[] = req.headers.authorization!.split(" ");
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
      id: ObjectId;
    }; // have to check if we can avoid using as
    if (decoded) {
      req.body.id = decoded.id;
      next();
    } else {
      res.status(403).json({
        msg: "You're not logged in",
      });
      return;
    }
  } catch (err) {
    res.json({
      msg: (err as Error).message,
      errorStack: (err as Error).stack,
    });
  }
};
