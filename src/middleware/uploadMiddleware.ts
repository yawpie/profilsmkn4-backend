// src/middleware/upload.ts
import multer from "multer";

// In-memory storage so you can upload to Firebase directly
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    if (!isImage) {
      cb(new Error("Only image files are allowed!"));
    } else {
      cb(null, true);
    }
  },
});
