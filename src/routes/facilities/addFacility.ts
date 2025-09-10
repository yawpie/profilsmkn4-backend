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

const router: Router = Router();

router.post(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<FacilitiesRequestBody>, res: Response) => {
    // console.log("hello hai");
    
    try {
      const { name, description, location, status } = req.body;
      if (!name || !status) {
        throw new BadRequestError("Name and status are required");
      }
      const file = req.file;
      let imageUrl: string | undefined;
      if (file) {
        imageUrl = await uploadImageToFirebase(file, "facilities");
      }
      const createFacilities = await handlePrismaWrite(() =>
        prisma.facilities.create({
          data: {
            name,
            description,
            location,
            status,
            image_url: imageUrl,
          },
        })
      );
      console.log(`Created facility: ${createFacilities.name}`);

      sendData(res, createFacilities);
    } catch (err) {
      sendError(res, err);
    }
  }
);

export default router;
