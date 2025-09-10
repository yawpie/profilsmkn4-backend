import { Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { AuthRequest } from "../types/auth";
import { UnauthorizedError } from "../errorHandler/responseError";
import { sendError } from "../utils/send";


export function checkAccessWithCookie(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (process.env.NODE_ENV === "test") {
    req.admin = { adminId: "test-admin-id" };
    next();
    return;
  }
  const request = req;
  console.log("Request:", request.cookies);

  const accessToken = req.cookies?.access_token;
  console.log("accessToken:", accessToken);

  try {
    if (!accessToken) {
      throw new UnauthorizedError("Unauthorized");
    }
    const decoded = verifyJwt(accessToken);
    if (!decoded) {
      throw new UnauthorizedError("Invalid token");
    }
    req.admin = { adminId: decoded.adminId };
    next();
  } catch (err) {
    // res.json(GeneralResponse.sendError(err));
    sendError(res, err);
  }
}
