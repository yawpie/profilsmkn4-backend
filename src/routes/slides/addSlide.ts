import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import { sendData, sendError } from "../../utils/send";
import { BadRequestError } from "../../errorHandler/responseError";
import { uploadImage } from "../../utils/imageServiceHandler";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";

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

router.post(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<SlideRequestBody>, res: Response) => {
    console.log("backend req.file:", {
      originalname: req.file?.originalname,
      size: req.file?.size,
      bufferLength: req.file?.buffer?.length,
    });
    try {
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

      if (!title) {
        throw new BadRequestError("title is required");
      }

      const file = req.file;
      if (!file) {
        throw new BadRequestError("image file is required");
      }

      const imageUrl = await uploadImage(file, "slides");
      console.log(imageUrl);

      const slide = await handlePrismaWrite(() =>
        prisma.slides.create({
          data: {
            image_url: imageUrl as string,
            alt,
            title,
            subtitle,
            description,
            gradientFrom,
            gradientTo,
            order: Number(order),
            isActive: Boolean(isActive),
          },
        })
      );

      // Map DB record shape to frontend contract
      const responseBody = {
        id: slide.id,
        image: slide.image_url,
        alt: slide.alt,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        gradientFrom: slide.gradientFrom,
        gradientTo: slide.gradientTo,
        order: slide.order,
        isActive: slide.isActive,
      };

      sendData(res, responseBody);
    } catch (error) {
      console.log(error);

      sendError(res, error);
    }
  }
);

export default router;
