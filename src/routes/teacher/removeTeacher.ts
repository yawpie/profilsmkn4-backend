// Todo 1: tambahkan remove-teacher

import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
// import GeneralResponse from "../../utils/generalResponse";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { sendData, sendError } from "../../utils/send";
import { NotFoundError } from "../../errorHandler/responseError";
import { deleteFirebaseFile } from "../../utils/firebaseHandler";
import { deleteImage } from "../../utils/imageServiceHandler";

const router = Router();

router.delete(
  "/:id",
  checkAccessWithCookie,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
      if (!id) {
        throw new NotFoundError("Teacher not found");
      }
      const imageUrlToDelete = await handlePrismaNotFound(() =>
        prisma.guru.findUnique({
          where: {
            guru_id: id,
          },
          select: {
            image_url: true,
          },
        })
      );
      if (imageUrlToDelete.image_url) {
        deleteImage(imageUrlToDelete.image_url);
      }

      const deleted = await handlePrismaNotFound(
        () =>
          prisma.guru.delete({
            where: {
              guru_id: id,
            },
          }),
        "Teacher not found"
      );
      // res.json(GeneralResponse.defaultResponse());
      sendData(res, deleted);
    } catch (error) {
      // res.json(GeneralResponse.unexpectedError(error));
      sendError(res, error);
    }
  }
);

export default router;
