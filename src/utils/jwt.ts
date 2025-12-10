import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StringValue } from "ms";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

interface JwtPayload {
  adminId: string;
}

export function generateToken(
  payload: JwtPayload,
  expiresIn: StringValue | number
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
}
export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET || "defaultrefreshsecret",
    { expiresIn: "7d" }
  );
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const result = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return result;
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const REFRESH_SECRET =
      process.env.REFRESH_TOKEN_SECRET || "defaultrefreshsecret";
    const result = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
    return result;
  } catch (err) {
    return null;
  }
}
