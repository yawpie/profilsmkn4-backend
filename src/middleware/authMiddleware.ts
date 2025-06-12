import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export interface AuthRequest extends Request {
    admin?: {
        adminId: string;
    };

}

export interface ArticleRequest extends Request {
    file?: Express.Multer.File;
}
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