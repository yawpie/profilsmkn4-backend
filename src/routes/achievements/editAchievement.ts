import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import { sendData, sendError } from "../../utils/send";
import { BadRequestError } from "../../errorHandler/responseError";
import { deleteImage, uploadImage } from "../../utils/imageServiceHandler";
import { handlePrismaNotFound } from "../../utils/handleNotFound";

interface AchievementRequestBody {
  title: string;
  publishDate?: string;
  description: string;
  content: string;
}

const router = Router();

router.put(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<AchievementRequestBody>, res: Response) => {
    const id = req.query.id;
    const { title, publishDate, description, content } = req.body;

    // if (!title || !description || !content) {
    //   return sendError(
    //     res,
    //     new BadRequestError("title, description, and content are required")
    //   );
    // }

    let imageUrl: string | null = null;
    const imageFile = req.file;

    try {
      if (imageFile) {
        // Delete old image if exists
        const imageUrlToDelete = await handlePrismaNotFound(() =>
          prisma.achievements.findUnique({
            where: { id },
            select: { image_url: true },
          })
        );

        if (imageUrlToDelete.image_url) {
          deleteImage(imageUrlToDelete.image_url);
        }

        imageUrl = (await uploadImage(imageFile, "achievements")) as
          | string
          | null;
      } else {
        // Keep existing image
        const existing = await handlePrismaNotFound(() =>
          prisma.achievements.findUnique({
            where: { id },
            select: { image_url: true },
          })
        );
        imageUrl = existing.image_url;
      }

      const updated = await handlePrismaNotFound(() =>
        prisma.achievements.update({
          where: { id },
          data: {
            title,
            publishDate: publishDate ? new Date(publishDate) : undefined,
            description,
            content,
            image_url: imageUrl,
          },
        })
      );

      const responseBody = {
        id: updated.id,
        title: updated.title,
        publishDate: updated.publishDate.toISOString(),
        description: updated.description,
        content: updated.content,
        image: updated.image_url,
      };

      sendData(res, responseBody);
    } catch (error) {
      sendError(res, error);
    }
  }
);

export default router;
