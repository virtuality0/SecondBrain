import { Router } from "express";
import { Content } from "../db";
import { validate } from "../middlewares/validate";
import { contentSchema } from "../schemas/content";
export const contentRouter = Router();

contentRouter.get("/getAll", async (req, res) => {
  try {
    const content = await Content.find({ userId: req.body.id.toString() });
    res.json({
      content: content,
    });
  } catch (err) {
    res.json({
      msg: (err as Error).message,
      errorStack: (err as Error).stack,
    });
  }
});

contentRouter.post("/add", validate(contentSchema), async (req, res) => {
  const { title, tags, link, type } = req.body;
  const userId = req.body.id;
  try {
    await Content.create({
      title: title,
      link: link,
      type: type,
      userId: userId,
      tags: tags, // have to do sth about tags
    });

    res.json({
      msg: "Content added successfully.",
    });
  } catch (err) {
    res.json({
      msg: (err as Error).message,
      errorStack: (err as Error).stack,
    });
  }
});

contentRouter.delete("/delete", async (req, res) => {
  try {
    const { contentId } = req.body;
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
    res.json({
      msg: (err as Error).message,
      errorStack: (err as Error).stack,
    });
  }
});
