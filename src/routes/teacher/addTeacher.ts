import { Response, Router } from "express";
import { prisma } from "../../config/database/prisma"
import { TeacherRequestBody } from "../../types/teacher";
import { AuthRequest } from "../../types/auth";
// import GeneralResponse from "../../utils/generalResponse";
// import ResponseError from "../../types/responseError";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import HttpError from "../../types/responseError";

const router = Router()


router.post("/", checkAuthWithCookie, async (req: AuthRequest<TeacherRequestBody>, res: Response) => {
    const { name, jabatan } = req.body;
    try {
        if (!name || !jabatan) {
            throw new HttpError("nama dan jabatan kosong!", 400);
        }
        const teacher = await prisma.guru.create({
            data: {
                name,
                jabatan
            }
        })
        // res.json(GeneralResponse.responseWithData(teacher));
        // GeneralResponse.sendWithData(res, teacher);
        sendData(res, teacher);
    } catch (error) {
        // res.json(GeneralResponse.sendError(error));
        sendError(res, error);
    }
})

export default router;