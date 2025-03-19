import { model, Schema } from "mongoose";
import { typeEnum } from "./enums/typeEnum";

const userSchema = new Schema({
  username: {
    type: String,
    unique: [true, "Username already taken"],
  },
  password: String,
});

const contentSchema = new Schema({
  type: { type: String, enum: typeEnum },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  link: String,
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  title: String,
});

const tagSchema = new Schema({
  title: String,
});

const linkSchema = new Schema({
  hash: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Create models from Schemas
const User = model("Users", userSchema);
const Content = model("Contents", contentSchema);
const Link = model("Links", linkSchema);
const Tag = model("Tags", tagSchema);

// exporting models
export { User, Content, Link, Tag };
