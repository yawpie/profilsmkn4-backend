import { Router, Request, Response } from "express";
// import { hashPassword } from '../../middleware/hashMiddleware';
import { prisma } from "../../config/database/prisma";
// import GeneralResponse from '../../utils/generalResponse';
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import bcrypt from "bcrypt";
import { sendData, sendError } from "../../utils/send";
import {
  BadRequestError,
  NotFoundError,
} from "../../errorHandler/responseError";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { hashPassword } from "../../middleware/hashMiddleware";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";

const router = Router();

router.post("", async (req: AuthRequest, res: Response) => {
    try {
        res
        .clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
        .clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        }).status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        sendError(res, error);
    }
})

export default router;