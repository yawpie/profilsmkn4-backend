import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import { sendData, sendError } from "../../utils/send";
import { BadRequestError } from "../../errorHandler/responseError";
import { deleteImage, uploadImage } from "../../utils/imageServiceHandler";
import { handlePrismaNotFound } from "../../utils/handleNotFound";

interface SlideRequestBody {
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  order: number;
  isActive?: boolean;
}

const router = Router();

router.put(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<SlideRequestBody>, res: Response) => {
    const id = req.query.id as string;
    const {
      alt,
      title,
      subtitle,
      description,
      gradientFrom,
      gradientTo,
      order,
      isActive = true,
    } = req.body;

    // if (!title || !alt) {
    //   return sendError(res, new BadRequestError("alt and title are required"));
    // }

    let imageUrl: string | null = null;
    const imageFile = req.file;

    try {
      if (imageFile) {
        const imageUrlToDelete = await handlePrismaNotFound(() =>
          prisma.slides.findUnique({
            where: { id },
            select: { image_url: true },
          })
        );

        if (imageUrlToDelete.image_url) {
          deleteImage(imageUrlToDelete.image_url);
        }

        imageUrl = (await uploadImage(imageFile, "slides")) as string | null;
      } else {
        const existing = await handlePrismaNotFound(() =>
          prisma.slides.findUnique({
            where: { id },
            select: { image_url: true },
          })
        );
        imageUrl = existing.image_url;
      }

      const updated = await handlePrismaNotFound(() =>
        prisma.slides.update({
          where: { id },
          data: {
            alt,
            title,
            subtitle,
            description,
            gradientFrom,
            gradientTo,
            order: Number(order),
            isActive: Boolean(isActive),
            image_url: imageUrl,
          },
        })
      );

      const responseBody = {
        id: updated.id,
        image: updated.image_url,
        alt: updated.alt,
        title: updated.title,
        subtitle: updated.subtitle,
        description: updated.description,
        gradientFrom: updated.gradientFrom,
        gradientTo: updated.gradientTo,
        order: updated.order,
        isActive: updated.isActive,
      };

      sendData(res, responseBody);
    } catch (error) {
      sendError(res, error);
    }
  }
);

export default router;
