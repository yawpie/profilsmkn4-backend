import { Request } from "express";
import { AuthRequest } from "./auth";

export interface CategoryRequest extends AuthRequest {
    category?: {
        category_name: string;
    };

}