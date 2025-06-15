import { Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import GeneralResponse from "../utils/generalResponse";
import { AuthRequest } from "../types/auth";

export function authToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const decoded = verifyJwt(token);
    if (!decoded) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
    req.admin = { adminId: decoded.adminId };
    next();
}

export function chechAuthWithCookie(req: AuthRequest, res: Response, next: NextFunction): void {
    if (process.env.NODE_ENV === "test") {
        req.admin = { adminId: "test-admin-id" };
        next();
        return;
    }

    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json(GeneralResponse.responseWithError("Unauthorized"));
        return;
    }

    try {
        const decoded = verifyJwt(token);
        if (!decoded) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.admin = { adminId: decoded.adminId };
        next();
    } catch (err) {
        res.status(403).json(GeneralResponse.responseWithError("Unauthorized"));
        return;
    }
}