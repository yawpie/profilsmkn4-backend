import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import { sendData, sendError } from "../../utils/send";
import { BadRequestError } from "../../errorHandler/responseError";
import { uploadImage } from "../../utils/imageServiceHandler";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";

interface AchievementRequestBody {
  title: string;
  publishDate?: string;
  description: string;
  content: string;
}

const router = Router();

router.post(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<AchievementRequestBody>, res: Response) => {
    try {
      const { title, publishDate, description, content } = req.body;

      if (!title || !description || !content) {
        throw new BadRequestError(
          "title, description, and content are required"
        );
      }

      const file = req.file;
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImage(file, "achievements");
      }

      const achievement = await handlePrismaWrite(() =>
        prisma.achievements.create({
          data: {
            title,
            publishDate: publishDate ? new Date(publishDate) : new Date(),
            description,
            content,
            image_url: imageUrl,
          },
        })
      );

      const responseBody = {
        id: achievement.id,
        title: achievement.title,
        publishDate: achievement.publishDate.toISOString(),
        description: achievement.description,
        content: achievement.content,
        image: achievement.image_url,
      };

      sendData(res, responseBody);
    } catch (error) {
      sendError(res, error);
    }
  }
);

export default router;
