import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body);
    if (validationResult.success) {
      next();
    } else {
      res.json({
        error: validationResult.error,
      });
      return;
    }
  };
