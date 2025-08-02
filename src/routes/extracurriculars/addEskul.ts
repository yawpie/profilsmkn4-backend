import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { BadRequestError } from "../../errorHandler/responseError";
import { sendData, sendError } from "../../utils/send";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import { uploadImageToFirebase } from "../../utils/firebaseHandler";
import { FacilitiesRequestBody } from "../../types/facilities";
import { ExtraCurricularsRequestBody } from "../../types/extracurriculars";

const router: Router = Router();

router.post(
  "/",
  checkAuthWithCookie,
  upload.single("image"),
  async (req: AuthRequest<ExtraCurricularsRequestBody>, res: Response) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        throw new BadRequestError("Name are required");
      }
      const file = req.file;

      const imageUrl = await uploadImageToFirebase(file, "extracurriculars");
      const create = await handlePrismaWrite(() =>
        prisma.extracurriculars.create({
          data: {
            name,
            description,
            image_url: imageUrl,
          },
        })
      );
      sendData(res, create);
    } catch (err) {
      sendError(res, err);
    }
  }
);

export default router;
