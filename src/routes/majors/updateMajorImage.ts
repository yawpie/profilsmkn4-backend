// Todo 3: tambahkan edit-teacher

import { Response, Router } from "express";
import { AuthRequest } from "../../types/auth";
import { TeacherRequestBody } from "../../types/teacher";
// import GeneralResponse from "../../utils/generalResponse";
import { prisma } from "../../config/database/prisma";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import { upload } from "../../middleware/uploadMiddleware";
import { FacilitiesRequestBody } from "../../types/facilities";
import { ExtraCurricularsRequestBody } from "../../types/extracurriculars";
import { MajorsRequestBody } from "../../types/majors";
import { deleteImage, uploadImage } from "../../utils/imageServiceHandler";
import { BadRequestError } from "../../errorHandler/responseError";

const router = Router();

router.put(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    const id = req.query.id as string;
    const { title } = req.body;
    if (!title) {
      throw new BadRequestError("title not provided");
    }
    let imageUrl: string | null = null;
    const imageFile = req.file;
    try {
      if (imageFile) {
        // first delete the old file
        const imageUrlToDelete = await handlePrismaNotFound(() =>
          prisma.major_gallery_images.findUnique({
            where: {
              id,
            },
            select: {
              image_url: true,
            },
          })
        );
        if (imageUrlToDelete.image_url) {
          deleteImage(imageUrlToDelete.image_url);
        }
        // after deleting, upload the new file
        imageUrl = await uploadImage(imageFile, "majors_gallery");
      } else {
        const findImageUrl = await handlePrismaNotFound(() =>
          prisma.major_gallery_images.findUnique({
            where: {
              id,
            },
            select: {
              image_url: true,
            },
          })
        );
        imageUrl = findImageUrl.image_url;
      }

      const updated = await handlePrismaNotFound(
        () =>
          prisma.major_gallery_images.update({
            where: {
              id,
            },
            data: {
              title,
              image_url: imageUrl,
            },
          }),
        "Extracurricular not found"
      );
      // res.json(GeneralResponse.responseWithData(updated));
      sendData(res, updated);
    } catch (error) {
      // res.json(GeneralResponse.sendError(error));
      sendError(res, error);
    }
  }
);

export default router;
