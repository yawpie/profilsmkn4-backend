import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database/prisma";
// import GeneralResponse from "../utils/generalResponse";
import { AuthRequest } from "../types/auth";
import { ArticlesBodyRequest, CategoryRequest, ExtraCategoryField } from "../types/category";
import HttpError, { BadRequestError, NotFoundError } from "../types/responseError";
import { sendError } from "../utils/send";


export async function checkCategoryId(req: AuthRequest<ArticlesBodyRequest, any, any, ExtraCategoryField>, res: Response, next: NextFunction) {
    const categoryName = req.body.category_name;
    try {
        if (!categoryName) {
            // res.status(400).json(GeneralResponse.responseWithError("Category must be provided!"));
            throw new BadRequestError("Category must be provided!");

        }

        const category = await prisma.category.findFirst({
            where: {
                name: categoryName
            }
        });
        if (!category) {
            // res.status(404).json(GeneralResponse.responseWithError("Category not found, please make it first"));
            throw new NotFoundError("Category not found, please make it first");

        }
        req.category_id = category.category_id
        next();

    } catch (error) {
        console.error(error);
        // res.json(GeneralResponse.sendError(error));
        sendError(res, error);
    }
}
