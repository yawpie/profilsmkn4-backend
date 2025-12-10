import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { deleteImage } from "../../utils/imageServiceHandler";
import { BadRequestError } from "../../errorHandler/responseError";

const router = Router();

router.delete(
  "/",
  checkAccessWithCookie,
  async (req: AuthRequest, res: Response) => {
    const id = req.query.id as string;

    try {
      if (!id) {
        throw new BadRequestError("Invalid id");
      }

      const imageUrlToDelete = await handlePrismaNotFound(() =>
        prisma.slides.findUnique({
          where: { id },
          select: { image_url: true },
        })
      );

      if (imageUrlToDelete.image_url) {
        deleteImage(imageUrlToDelete.image_url);
      }

      const deleted = await handlePrismaNotFound(() =>
        prisma.slides.delete({
          where: { id },
        })
      );

      sendData(res, deleted);
    } catch (error) {
      sendError(res, error);
    }
  }
);

export default router;
