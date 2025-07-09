import multer from "multer";
import { AuthRequest } from "../types/auth";
import { sendError } from "../utils/send";
import { Response } from "express";


export const multerErrorHandler = (err:any, req: AuthRequest, res:Response, next:Function) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer errors (like Unexpected field)
    return sendError(res, err, 400);
  }

  if (err) {
    // Other unexpected errors
    return sendError(res, err,500);
  }

  next();
}