import fs from "fs";
import path from "path";
import sharp from "sharp";
// import FormData from "form-data";
// import fetch from "node-fetch";
const UPLOAD_ENDPOINT = "http://localhost:4000/images"; // change to your endpoint

/**
 * Upload an image to the backend image controller
 * Automatically converts images to WebP format for better compression
 * @param file The image file to upload
 * @param folder Optional folder name to organize uploads on the server
 */
export async function uploadImage(
  file: Express.Multer.File,
  folder?: string
): Promise<string | null> {
  try {
    // Convert image to WebP format using sharp
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 85 }) // Adjust quality (1-100, default 80)
      .toBuffer();

    // Update filename to .webp extension
    const originalNameWithoutExt = path.parse(file.originalname).name;
    const webpFilename = `${originalNameWithoutExt}.webp`;

    const formData = new FormData();

    formData.append(
      "image",
      new Blob([new Uint8Array(webpBuffer)], { type: "image/webp" }),
      webpFilename
    );

    // Build upload URL with optional folderName as query param
    let uploadUrl = UPLOAD_ENDPOINT;
    if (folder) {
      uploadUrl += `?folder=${encodeURIComponent(folder)}`;
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "x-api-key": process.env.IMAGE_SERVICE_API_KEY || "",
      },
      body: formData,
    });

    if (!response.ok) {
      console.error(`Upload failed: ${response.status} ${response.statusText}`);
      return null;
    }

    type ImgServiceData = {
      url: string;
      id: string;
      originalName: string;
      f1leName: string;
      mimeType: string;
      size: number;
      path: string;
      createdAt: Date;
    };
    const data = (await response.json()) as ImgServiceData;
    const imageUrl = data.url;
    if (!imageUrl) {
      console.log("data: ", data);
      return null;
    }
    return imageUrl as string;
  } catch (error) {
    console.error("Error processing/uploading image:", error);
    return null;
  }
}

export async function deleteImage(url: string) {
  const response = await fetch(`${UPLOAD_ENDPOINT}/?url=${url}`, {
    method: "DELETE",
    headers: {
      "x-api-key": process.env.IMAGE_SERVICE_API_KEY || "",
    },
  });

  if (!response.ok) {
    // throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    console.error(`Delete failed: ${response.status} ${response.statusText}`);
    return { success: false };
  }
  return await response.json();
}
