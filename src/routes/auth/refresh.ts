import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { sendError } from "../../utils/send";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../errorHandler/responseError";
import { handlePrismaNotFound } from "../../utils/handleNotFound";

const router = Router();

router.post("", async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    return sendError(res, new BadRequestError("Refresh token is required"));
  }

  try {
    // Verify refresh token with dedicated function
    const payload = verifyRefreshToken(token);
    if (!payload) {
      return sendError(
        res,
        new UnauthorizedError("Invalid or expired refresh token")
      );
    }

    // Verify admin still exists
    const admin = await handlePrismaNotFound(
      () => prisma.admin.findUnique({ where: { admin_id: payload.adminId } }),
      "Admin not found"
    );

    // Generate new tokens (token rotation for security)
    const newAccessToken = generateToken({ adminId: admin.admin_id }, "15m");
    const newRefreshToken = generateRefreshToken({ adminId: admin.admin_id });

    res
      .status(200)
      .cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .json({
        message: "Token refreshed successfully",
        access_token: newAccessToken,
      });
  } catch (err: any) {
    sendError(res, err);
  }
});

export default router;
