import { Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { AuthRequest } from "../types/auth";
import { UnauthorizedError } from "../errorHandler/responseError";
import { sendError } from "../utils/send";


export function checkAuthWithCookie(req: AuthRequest, res: Response, next: NextFunction): void {
    if (process.env.NODE_ENV === "test") {
        req.admin = { adminId: "test-admin-id" };
        next();
        return;
    }

    const token = req.cookies?.token;

    try {
        if (!token) {
            throw new UnauthorizedError("Unauthorized");
        }
        const decoded = verifyJwt(token);
        if (!decoded) {
            throw new UnauthorizedError("Invalid token");
        }
        req.admin = { adminId: decoded.adminId };
        next();
    } catch (err) {
        // res.json(GeneralResponse.sendError(err));
        sendError(res, err)
    }
}

