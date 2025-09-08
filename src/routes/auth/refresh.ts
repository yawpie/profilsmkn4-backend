import { Router, Request, Response } from "express";
// import { hashPassword } from '../../middleware/hashMiddleware';
import { prisma } from "../../config/database/prisma";
// import GeneralResponse from '../../utils/generalResponse';
import {
  generateRefreshToken,
  generateToken,
  verifyJwt,
} from "../../utils/jwt";
import bcrypt from "bcrypt";
import { sendData, sendError } from "../../utils/send";
import {
  BadRequestError,
  NotFoundError,
} from "../../errorHandler/responseError";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { hashPassword } from "../../middleware/hashMiddleware";

const router = Router();

router.post("", async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  console.log(token);

  if (!token) {
    return sendError(res, new BadRequestError("Refresh token is required"));
  }

  try {
    const payload = verifyJwt(token);
    if (!payload) {
      return sendError(res, new BadRequestError("Invalid refresh token"));
    }

    const admin = await handlePrismaNotFound(
      () => prisma.admin.findUnique({ where: { admin_id: payload.adminId } }),
      "Admin not found"
    );

    const newAccessToken = generateToken({ adminId: admin.admin_id }, "15m");
    const newRefreshToken = generateRefreshToken({ adminId: admin.admin_id });

    res
      .status(200)
      .cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json({ message: "success", access_token: newAccessToken });
  } catch (err: any) {
    sendError(res, err);
  }
});
export default router;
