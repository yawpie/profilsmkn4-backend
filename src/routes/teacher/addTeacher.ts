import { Response, Router } from "express";
import { prisma } from "../../config/database/prisma"
import { TeacherRequestBody } from "../../types/teacher";
import { AuthRequest } from "../../types/auth";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import { BadRequestError } from "../../errorHandler/responseError";
import { upload } from "../../middleware/uploadMiddleware";
import { uploadImageToFirebase } from "../../utils/firebaseHandler";

const router = Router()


router.post("/", checkAuthWithCookie, upload.single("image"), async (req: AuthRequest<TeacherRequestBody>, res: Response) => {
    const { name, jabatan } = req.body;
    const imageFile = req.file;
    try {
        const imageUrl = await uploadImageToFirebase(imageFile, "teachers");
        if (!name || !jabatan) {
            throw new BadRequestError("nama dan jabatan kosong");
        }
        const teacher = await prisma.guru.create({
            data: {
                name,
                jabatan,
                image_url: imageUrl
            }
        })
        sendData(res, teacher);
    } catch (error) {
        sendError(res, error);
    }
})

export default router;