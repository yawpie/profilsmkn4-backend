import { Router, Request, Response } from "express";
import { chechAuthWithCookie } from "../../middleware/authMiddleware";
import { prisma } from "../../config/database/prisma";
import GeneralResponse from "../../utils/generalResponse";
import ResponseError from "../../types/responseError";
import { AuthRequest } from "../../types/auth";

const router: Router = Router();

router.post("/", chechAuthWithCookie, async (req: AuthRequest, res: Response) => {
    try {
        const newCategory = req.body.category_name;
        if (!newCategory) {
            throw new ResponseError("Category message required", "RequestBodyError");
        }

        const createCategory = await prisma.category.create({
            data: {
                name: newCategory
            }
        });
        res.status(200).send(GeneralResponse.responseWithMessage("Category created successfully").setData(createCategory));
    } catch (err) {
        res.status(500).json(GeneralResponse.responseWithError(err));
    }
});

export default router;
