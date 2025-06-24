// Todo 2: tambahkan get-teacher

import { Response, Router } from "express";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { prisma } from "../../config/database/prisma";
import { paginate } from "../../types/pagination";
// import GeneralResponse from "../../utils/generalResponse";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";

const router = Router();

router.get("/",checkAuthWithCookie, async (req: AuthRequest, res: Response) => {
    const guruName = req.query.nama as string;

    try {
        if (guruName) {
            const guru = await handlePrismaNotFound(() =>
                prisma.guru.findMany({
                    where: {
                        name: {
                            contains: guruName,
                            mode: 'insensitive',
                        },
                        
                    },
                }), "guru not found"
            )
            sendData(res, guru);
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * pageSize;

        const result = await paginate(
            // query function (receives skip and take)
            (skip, take) =>
                prisma.guru.findMany({
                    skip,
                    take,
                }),
            // count function
            () => prisma.guru.count(),
            // pagination params
            { page, pageSize }
        );

        // res.json(GeneralResponse.responseWithData(result.data));
        sendData(res, result);
    } catch (err) {
        console.error(err);
        // res.json(GeneralResponse.unexpectedError(err));
        sendError(res, err);
    }


});

export default router;