// src/middleware/upload.ts
import multer from "multer";
import { BadRequestError } from "../errorHandler/responseError";

// In-memory storage so you can upload to Firebase directly
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (_req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    if (!isImage) {
      cb(new BadRequestError("Only image files are allowed!"));
    } else {
      cb(null, true);
    }
  },
});
