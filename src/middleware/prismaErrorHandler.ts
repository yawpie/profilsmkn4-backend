import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma";


/**
 * 
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 * @deprecated
 */
const prismaErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                 res.status(409).json({
                    success: false,
                    message: "Duplicate field value",
                    field: err.meta?.target,
                });
                 return;

            case "P2025":
                 res.status(404).json({
                    success: false,
                    message: "Record not found",
                });
                return

            case "P2003":
                 res.status(400).json({
                    success: false,
                    message: "Foreign key constraint failed",
                    field: err.meta?.field_name,
                });
                return
            default:
                 res.status(400).json({
                    success: false,
                    message: `Prisma error code: ${err.code}`,
                });
        }
    }

    // Validation error (e.g., missing required fields)
    if (err instanceof Prisma.PrismaClientValidationError) {
         res.status(400).json({
            success: false,
            message: "Validation error: Invalid data provided",
        });
         return;
    }

    // Unknown Prisma errors
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
         res.status(500).json({
            success: false,
            message: "Unknown Prisma error occurred",
        });
         return;
    }

    // Let other errors bubble up
    next(err);
};

export default prismaErrorHandler;
