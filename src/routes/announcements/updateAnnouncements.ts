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
import { ExtraCurricularsRequestBody } from "../../types/extracurriculars";
import { MajorsRequestBody } from "../../types/majors";
import { AnnouncementsRequestBody } from "../../types/announcements";

const router = Router();

router.put(
  "/:id",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<AnnouncementsRequestBody>, res: Response) => {
    const id = req.params.id;
    const { title, content, date, status } = req.body;

    // if (!name || !jabatan) {
    //     res.status(404).json(GeneralResponse.responseWithError("nama dan jabatan kosong!"));
    //     return;
    // }

    try {
      const updated = await handlePrismaNotFound(
        () =>
          prisma.announcements.update({
            where: {
              id,
            },
            data: {
              title,
              content,
              status,
              date,
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
