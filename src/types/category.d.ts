import { Request } from "express";
import { AuthRequest } from "./auth";

export interface CategoryRequest extends AuthRequest {
    category_name: string;
    category_id?: string;
}

export type CategoryBody = Request & {
    title: string;
    content: string;
    category_name: string;
    // note: Image is handled by uploadMiddleware
}
export type ExtraCategoryField = {
    category_id?: string; // careful with the optional mark
}
