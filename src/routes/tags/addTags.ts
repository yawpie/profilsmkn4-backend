import { Router, Request, Response } from "express";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { prisma } from "../../config/database/prisma";
import { BadRequestError } from "../../errorHandler/responseError";
import { AuthRequest } from "../../types/auth";
import { sendData, sendError } from "../../utils/send";
import { validateCategory } from "../../validation/categoryValidator";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";

const router: Router = Router();

router.post(
  "/",
  checkAccessWithCookie,
  validateCategory,
  async (req: AuthRequest, res: Response) => {
    try {
      const newCategory = req.body.category_name as string;

      if (!newCategory) {
        throw new BadRequestError("Category name is required");
      }

      const createCategory = await handlePrismaWrite(() =>
        prisma.tags.create({
          data: {
            name: newCategory,
            slug: newCategory.toLowerCase().replace(/ /g, "-"),
          },
        })
      );
      sendData(res, createCategory);
    } catch (err) {
      sendError(res, err);
    }
  }
);

export default router;
