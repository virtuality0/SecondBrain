import { Router } from "express";
import { Content } from "../db";
import { validate } from "../middlewares/validate";
import { contentSchema } from "../schemas/content";
export const contentRouter = Router();

contentRouter.get("/getAll", async (req, res) => {
  const content = await Content.find({ userId: req.body.id.toString() });
  res.json({
    content: content,
  });
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
    res.status(500).json({
      msg: "Server Error",
    });
  }
});
