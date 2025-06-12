import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

interface JwtPayload {
    adminId: string;
}

export function generateToken(payload: JwtPayload, expiresIn: '1h'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
}

export function verifyJwt(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
        return null;
    }
}