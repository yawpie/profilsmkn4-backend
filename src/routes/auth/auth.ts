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

const router = Router();
router.post("", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // console.log(req.body);

  try {
    if (!username || !password) {
      throw new BadRequestError("Username and password are required");
    }
    if (typeof username !== "string" || typeof password !== "string") {
      // res.json(GeneralResponse.badRequest("Invalid username or password"));
      throw new BadRequestError("Invalid username or password");
    }
    // const admin = await handlePrismaNotFound(() => {
    //      prisma.admin.findUnique({
    //         where: {
    //             username: username,
    //         },
    //     });

    // }, "Admin not found");
    // if (!admin) {
    //     throw new NotFoundError("Admin not found");
    // }

    const admin = await handlePrismaNotFound(
      () =>
        prisma.admin.findUnique({
          where: {
            username: username,
          },
        }),
      "Username or Password incorrect"
    );

    const passwordMatch = await bcrypt.compare(password, admin.hashed_password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid password");
    }
    const refreshToken = generateRefreshToken({ adminId: admin.admin_id });
    const accessToken = generateToken({ adminId: admin.admin_id }, "15m");
    // res.status(200).json(GeneralResponse.defaultResponse().setData({ token: token }));
    res
    .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json({ message: "success", access_token: accessToken })
    // sendData(res, { token }, "success");
  } catch (err: any) {
    // console.log(err);
    // res.json(GeneralResponse.unexpectedError(err));
    sendError(res, err);
  }
});

export default router;
