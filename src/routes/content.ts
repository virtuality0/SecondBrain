import { Router } from "express";
import { Content } from "../db";
import { validate } from "../middlewares/validate";
import { contentSchema } from "../schemas/content";
import { auth } from "../middlewares/auth";
export const contentRouter = Router();

contentRouter.get("/getAll", auth, async (req, res) => {
  const type = req.query.type;
  try {
    const content = await Content.find({
      userId: req.body.id.toString(),
      type: type ?? { $in: ["youtube", "tweet", "link"] },
    });
    res.json({
      content: content,
    });
  } catch (err) {
    res.status(500).json({
      msg: (err as Error).message,
      errorStack: (err as Error).stack,
    });
  }
});

contentRouter.post("/add", auth, validate(contentSchema), async (req, res) => {
  const { title, tags, link, type } = req.body;
  const userId = req.body.id;
  try {
    await Content.create({
      title: title,
      link: link,
      type: type,
      userId: userId,
      tags: tags, // have to do sth about tags
      createdAt: new Date().toLocaleDateString(),
    });

    res.json({
      msg: "Content added successfully.",
    });
  } catch (err) {
    res.status(500).json({
      msg: (err as Error).message,
      errorStack: (err as Error).stack,
    });
  }
});

contentRouter.delete("/delete/:contentId", async (req, res) => {
  try {
    const contentId = req.params.contentId;
    if (contentId) {
      const deleted = await Content.deleteOne({ _id: contentId });
      if (deleted.deletedCount > 0) {
        res.json({
          msg: "Content deleted",
        });
      } else {
        res.json({
          msg: `No content found with id : ${contentId}`,
        });
      }
    } else {
      res.status(400).json({
        msg: "No content id passed",
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: (err as Error).message,
      errorStack: (err as Error).stack,
    });
  }
});
