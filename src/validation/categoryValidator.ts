import { Response } from "express";
import { AuthRequest } from "../types/auth";
import { sendError } from "../utils/send";
import { BadRequestError } from "../errorHandler/responseError";


export function validateCategory(req: AuthRequest, res: Response, next: Function) {
    const { category_name } = req.body;


    try {
        if (!category_name) {
            throw new BadRequestError("Category name is required");
        }
        if (typeof category_name !== "string") {
            throw new BadRequestError("Category name must be a string");
        }

        next();

    } catch (error) {
        sendError(res, error);
    }
}
