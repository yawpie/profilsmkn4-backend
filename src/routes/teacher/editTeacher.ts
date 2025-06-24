// Todo 3: tambahkan edit-teacher

import { Response, Router } from "express";
import { AuthRequest } from "../../types/auth";
import { TeacherRequestBody } from "../../types/teacher";
// import GeneralResponse from "../../utils/generalResponse";
import { prisma } from "../../config/database/prisma";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";

const router = Router();

router.put("/:id",checkAuthWithCookie, async (req: AuthRequest<TeacherRequestBody>, res: Response) => {
    const guru_id = req.params.id;
    const { name, jabatan } = req.body;
    // if (!name || !jabatan) {
    //     res.status(404).json(GeneralResponse.responseWithError("nama dan jabatan kosong!"));
    //     return;
    // }
    try {
        const updated = await handlePrismaNotFound(() =>
            prisma.guru.update({
                where: {
                    guru_id
                },
                data: {
                    name,
                    jabatan
                }
            }), "Teacher not found"
        );
        // res.json(GeneralResponse.responseWithData(updated));
        sendData(res, updated)
    } catch (error) {
        // res.json(GeneralResponse.sendError(error));
        sendError(res, error);
    }


})

export default router;