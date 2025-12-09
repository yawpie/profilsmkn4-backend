// Todo 3: tambahkan edit-teacher

import { Response, Router } from "express";
import { AuthRequest } from "../../types/auth";
import { TeacherRequestBody } from "../../types/teacher";
// import GeneralResponse from "../../utils/generalResponse";
import { prisma } from "../../config/database/prisma";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import {
  deleteFirebaseFile,
  uploadImageToFirebase,
} from "../../utils/firebaseHandler";
import { upload } from "../../middleware/uploadMiddleware";
import { FacilitiesRequestBody } from "../../types/facilities";
import { deleteImage, uploadImage } from "../../utils/imageServiceHandler";

const router = Router();

router.put(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<FacilitiesRequestBody>, res: Response) => {
    const id = req.query.id as string;
    const { name, description, location, status } = req.body;
    // if (!name || !jabatan) {
    //     res.status(404).json(GeneralResponse.responseWithError("nama dan jabatan kosong!"));
    //     return;
    // }
    let imageUrl: string | null = null;
    const imageFile = req.file;
    try {
      if (imageFile) {
        // first delete the old file
        const imageUrlToDelete = await handlePrismaNotFound(() =>
          prisma.facilities.findUnique({
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
        imageUrl = await uploadImage(imageFile, "teachers");
      } else {
        const findImageUrl = await handlePrismaNotFound(() =>
          prisma.facilities.findUnique({
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
          prisma.facilities.update({
            where: {
              id,
            },
            data: {
              name,
              description,
              location,
              status,
              image_url: imageUrl,
            },
          }),
        "Facility not found"
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
