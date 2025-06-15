import { Request } from "express";


export interface AuthRequest extends Request {
    admin?: {
        adminId: string;
    };
    
}
