import { z } from "zod";
import { typeEnum } from "../enums/typeEnum";

export const contentSchema = z.object({
  type: z.nativeEnum(typeEnum),
  title: z.string({ message: "Please enter a string for title" }),
  link: z.string(),
  tags: z.array(z.string()),
});
