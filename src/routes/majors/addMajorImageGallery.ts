import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";
import { AuthRequest } from "../../types/auth";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import { uploadImage } from "../../utils/imageServiceHandler";
import { BadRequestError } from "../../errorHandler/responseError";

const router: Router = Router();

router.post(
  "/add-image",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { major_id, title } = req.body;
      if (!major_id) {
        throw new BadRequestError("major_id not provided");
      }
      const file = req.file;
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImage(file, `majors/${major_id}`);
      }
      const create = await handlePrismaWrite(() =>
        prisma.major_gallery_images.create({
          data: {
            title,
            image_url: imageUrl,
            major: { connect: { id: major_id } },
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
