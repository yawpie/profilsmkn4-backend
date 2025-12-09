// src/middleware/upload.ts
import multer from "multer";
import { BadRequestError } from "../errorHandler/responseError";

// In-memory storage so you can upload to Firebase directly
const storage = multer.memoryStorage();
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/pjpeg"]; // todo move to env
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (_req, file, cb) => {
    const isImage = file.mimetype === ALLOWED_MIME_TYPES.find(type => type === file.mimetype);
    if (!isImage) {
      cb(new BadRequestError("Only image files are allowed!"));
    } else {
      cb(null, true);
    }
  },
});
