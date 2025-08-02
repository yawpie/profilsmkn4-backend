import { Router,Response } from "express";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";
import { paginate } from "../../types/pagination";

const router = Router();

router.get("/",checkAuthWithCookie, async (req: AuthRequest, res: Response) => {
    const facilityName = req.query.name as string;

    try {
        if (facilityName) {
            const guru = await handlePrismaNotFound(() =>
                prisma.facilities.findMany({
                    where: {
                        name: {
                            contains: facilityName,
                            mode: 'insensitive',
                        },

                    },
                }), "facility not found"
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
                prisma.facilities.findMany({
                    skip,
                    take,
                }),
            // count function
            () => prisma.facilities.count(),
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