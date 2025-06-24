import { Router, Request, Response } from "express";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { prisma } from "../../config/database/prisma";
// import GeneralResponse from "../../utils/generalResponse";
import HttpError, { BadRequestError } from "../../types/responseError";
import { AuthRequest } from "../../types/auth";
import { sendData, sendError } from "../../utils/send";

const router: Router = Router();

router.post("/", checkAuthWithCookie, async (req: AuthRequest, res: Response) => {
    try {
        const newCategory = req.body.category_name;
        if (!newCategory) {
            throw new BadRequestError("Category name is required")
        }

        const createCategory = await prisma.category.create({
            data: {
                name: newCategory
            }
        });
        // res.send(GeneralResponse.responseWithData(createCategory));
        sendData(res, createCategory)

    } catch (err) {
        // res.json(GeneralResponse.unexpectedError(err));
        sendError(res, err);
    }
});

export default router;
