import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database/prisma";
import GeneralResponse from "../utils/generalResponse";
import { AuthRequest } from "../types/auth";
import { CategoryRequest } from "../types/category";


export async function checkCategoryId(req: CategoryRequest, res: Response, next: NextFunction) {
    const category_id = req.body?.category_id;
    if (!category_id) {
        res.status(400).json(GeneralResponse.responseWithError("Category must be provided!"));
        return;
    }
    try {

        const category = await prisma.category.findUnique({
            where: {
                category_id: category_id
            }
        });
        if (!category) {
            res.status(404).json(GeneralResponse.responseWithError("Category not found, please make it first"));
            return;
        }
        req.category = { category_name: category?.name };
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json(GeneralResponse.responseWithError(error));
        return;
    }
}
