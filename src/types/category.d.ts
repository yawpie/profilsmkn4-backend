import { Request } from "express";
import { AuthRequest } from "./auth";

export interface CategoryRequest extends AuthRequest {
    category_name: string;
    category_id?: string;
}

export type ArticlesBodyRequest = Request & {
    title: string;
    content: string;
    // category_name: string;
    status: "DRAFT" | "PUBLISHED";
    // tags: string[] | null;
    tags: string | null | string[]; // can be string (JSON stringified) or string[] (from form-data)
    // note: Image is handled by uploadMiddleware
}
export type ExtraCategoryField = {
    category_id?: string; // careful with the optional mark
}
