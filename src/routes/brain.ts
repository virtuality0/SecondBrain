import { Router } from "express";
import { Content, Link } from "../db";
import bcrypt from "bcrypt";
import { auth } from "../middlewares/auth";

export const brainRouter = Router();

brainRouter.post("/share", auth, async (req, res) => {
  const { share } = req.body;
  const userId = req.body.id;
  if (share) {
    // create the shareable link or check if already exists for the user
    try {
      const existingLink = await Link.findOne({
        userId: userId,
      });
      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });
        return;
      }
      const hash = await bcrypt.hash(userId, 5);
      const hashWithoutSlash = hash.replace(/\//g, "FSlash"); // in order to avoid / in hash so when I hit the endpoint it dosen't give me 404
      await Link.create({
        userId: userId,
        hash: hashWithoutSlash,
      });

      res.json({
        hash: hash,
      });
    } catch (err) {
      res.status(500).json({
        msg: (err as Error).message,
        errorStack: (err as Error).stack,
      });
    }
  } else {
    await Link.deleteOne({
      userId: userId,
    });

    res.json({
      msg: "Link deleted.",
    });
  }
});

brainRouter.get("/:brainId", async (req, res) => {
  const hash = req.params.brainId;
  try {
    const link = await Link.findOne({
      hash,
    }).populate("userId");

    if (!link) {
      res.status(400).json({
        msg: "Invalid link.",
      });
      return;
    }

    const content = await Content.find({
      userId: link.userId,
    });

    res.json({
      username: "",
      content: content,
    });
  } catch (err) {
    res.status(500).json({
      msg: (err as Error).message,
      errorStack: (err as Error).stack,
    });
  }
});
