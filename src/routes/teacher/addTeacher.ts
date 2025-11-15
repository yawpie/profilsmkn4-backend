import { Response, Router } from "express";
import { prisma } from "../../config/database/prisma";
import { TeacherRequestBody } from "../../types/teacher";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import { BadRequestError } from "../../errorHandler/responseError";
import { upload } from "../../middleware/uploadMiddleware";
import { uploadImageToFirebase } from "../../utils/firebaseHandler";
import { uploadImage } from "../../utils/imageServiceHandler";

const router = Router();

router.post(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<TeacherRequestBody>, res: Response) => {
    const { name, jabatan, nip } = req.body;
    const imageFile = req.file;
    console.log("hello");
    
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "teachers");
      }
      if (!name || !jabatan) {
        throw new BadRequestError("nama dan jabatan kosong");
      }
      const teacher = await prisma.guru.create({
        data: {
          name,
          jabatan,
          image_url: imageUrl,
          nip
        },
      });
      sendData(res, teacher);
    } catch (error) {
      sendError(res, error);
    }
  }
);

export default router;
