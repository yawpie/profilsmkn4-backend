import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database/prisma";
import GeneralResponse from "../utils/generalResponse";
import { AuthRequest } from "../types/auth";
import { CategoryBody, CategoryRequest, ExtraCategoryField } from "../types/category";


export async function checkCategoryId(req: AuthRequest<CategoryBody, any, any, ExtraCategoryField >, res: Response, next: NextFunction) {
    const categoryName = req.body.category_name;
    if (!categoryName) {
        res.status(400).json(GeneralResponse.responseWithError("Category must be provided!"));
        return;
    }
    try {

        const category = await prisma.category.findFirst({
            where: {
                name: categoryName
            }
        });
        if (!category) {
            res.status(404).json(GeneralResponse.responseWithError("Category not found, please make it first"));
            return;
        }
        req.category_id = category.category_id
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json(GeneralResponse.responseWithError(error));
        return;
    }
}
