import { Router, Request, Response } from "express";
import { authToken } from "../../middleware/authMiddleware";
import { prisma } from "../../config/database/prisma";
import GeneralResponse from "../../utils/generalResponse";
import ResponseError from "../../utils/responseError";

const router: Router = Router();

router.post("/", authToken, async (req: Request, res: Response) => {
    try {
        const newCategory = req.body.category;
        if (!newCategory) {
            throw new ResponseError("Category message required", "RequestBodyError");
        }

        const createCategory = await prisma.category.create({
            data: {
                name: newCategory
            }
        });
        res.status(200).send(GeneralResponse.defaultResponse());
    } catch (err) {
        if (err instanceof ResponseError) {
            res.status(500).send(GeneralResponse.responseWithError(err));
        }

    }

});