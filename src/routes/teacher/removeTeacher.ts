// Todo 1: tambahkan remove-teacher

import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma"
import { AuthRequest } from "../../types/auth";
// import GeneralResponse from "../../utils/generalResponse";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { sendData, sendError } from "../../utils/send";
import { NotFoundError } from "../../types/responseError";

const router = Router();

router.delete("/:id", checkAuthWithCookie, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        if (!id) {
            // res.json(GeneralResponse.notFound());
            
            throw new NotFoundError("Teacher not found")
        }
        const deleted = await handlePrismaNotFound(() =>
            prisma.guru.delete({
                where: {
                    guru_id: id,
                }
            }), "Teacher not found"
        )
        // res.json(GeneralResponse.defaultResponse());
        sendData(res, deleted);
    } catch (error) {
        // res.json(GeneralResponse.unexpectedError(error));
        sendError(res,error);
    }
})

export default router;

