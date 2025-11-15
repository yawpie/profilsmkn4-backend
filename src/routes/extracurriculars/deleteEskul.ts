import { Router, Response } from "express";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { BadRequestError } from "../../errorHandler/responseError";
import { deleteImage } from "../../utils/imageServiceHandler";

const router = Router();

router.delete(
  "/:id",
  checkAccessWithCookie,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Invalid id");
      }
      const imageUrl = await handlePrismaNotFound(() =>
        prisma.extracurriculars.findUnique({
          where: {
            id,
          },
          select: {
            image_url: true,
          },
        })
      );

      if (imageUrl.image_url) {
        deleteImage(imageUrl.image_url);
      }
      const hapus = await handlePrismaWrite(() =>
        prisma.extracurriculars.delete({
          where: {
            id,
          },
        })
      );
      sendData(res);
    } catch (error) {
      sendError(res, error);
    }
  }
);

export default router;
