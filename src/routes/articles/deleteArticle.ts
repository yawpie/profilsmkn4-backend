import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { BadRequestError } from "../../errorHandler/responseError";
import { deleteImage } from "../../utils/imageServiceHandler";

const router = Router();

router.delete(
  "/",
  checkAccessWithCookie,
  async (req: AuthRequest, res: Response) => {
    try {
      const id = req.query.id;
      if (!id) {
        throw new BadRequestError("Invalid id");
      }
      const imageUrl = await handlePrismaNotFound(() =>
        prisma.articles.findUnique({
          where: {
            articles_id: id,
          },
          select: {
            image_url: true,
          },
        })
      );

      await handlePrismaNotFound(() =>
        prisma.articles.delete({
          where: {
            articles_id: id,
          },
        })
      );
      console.log("deleteArticle: ", imageUrl);

      if (imageUrl.image_url) {
        // deleteFirebaseFile(imageUrl.image_url);
        deleteImage(imageUrl.image_url);
      }

      sendData(res);
    } catch (error) {
      sendError(res, error);
    }
  }
);

export default router;
