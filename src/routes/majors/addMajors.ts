import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { BadRequestError } from "../../errorHandler/responseError";
import { sendData, sendError } from "../../utils/send";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import { uploadImageToFirebase } from "../../utils/firebaseHandler";
import { FacilitiesRequestBody } from "../../types/facilities";
import { ExtraCurricularsRequestBody } from "../../types/extracurriculars";
import { MajorsRequestBody } from "../../types/majors";

const router: Router = Router();

router.post(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<MajorsRequestBody>, res: Response) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        throw new BadRequestError("Name are required");
      }
      const file = req.file;
      let imageUrl: string | undefined;
      if (file) {
        imageUrl = await uploadImageToFirebase(file, "majors");
      }
      const create = await handlePrismaWrite(() =>
        prisma.majors.create({
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
