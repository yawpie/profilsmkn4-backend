// Todo 3: tambahkan edit-teacher

import { Response, Router } from "express";
import { AuthRequest } from "../../types/auth";
import { TeacherRequestBody } from "../../types/teacher";
// import GeneralResponse from "../../utils/generalResponse";
import { prisma } from "../../config/database/prisma";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { checkBearerToken } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import {
  deleteFirebaseFile,
  uploadImageToFirebase,
} from "../../utils/firebaseHandler";
import { upload } from "../../middleware/uploadMiddleware";
import { FacilitiesRequestBody } from "../../types/facilities";
import { ExtraCurricularsRequestBody } from "../../types/extracurriculars";

const router = Router();

router.put(
  "/:id",
  checkBearerToken,
  upload.single("image"),
  async (req: AuthRequest<ExtraCurricularsRequestBody>, res: Response) => {
    const id = req.params.id;
    const { name, description } = req.body;
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
          prisma.extracurriculars.findUnique({
            where: {
              id,
            },
            select: {
              image_url: true,
            },
          })
        );
        if (imageUrlToDelete.image_url) {
          deleteFirebaseFile(imageUrlToDelete.image_url);
        }
        // after deleting, upload the new file
        imageUrl = await uploadImageToFirebase(imageFile, "teachers");
      } else {
        const findImageUrl = await handlePrismaNotFound(() =>
          prisma.extracurriculars.findUnique({
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
          prisma.extracurriculars.update({
            where: {
              id,
            },
            data: {
              name,
              description,
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
