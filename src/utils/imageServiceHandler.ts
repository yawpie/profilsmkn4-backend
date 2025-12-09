import fs from "fs";
import path from "path";
// import FormData from "form-data";
// import fetch from "node-fetch";
const UPLOAD_ENDPOINT = "http://localhost:4000/images"; // change to your endpoint

/**
 * Upload an image to the backend image controller
 * @param file The image file to upload
 * @param folder Optional folder name to organize uploads on the server
 */
export async function uploadImage(
  file: Express.Multer.File,
  folder?: string
): Promise<string | null> {
  const formData = new FormData();

  // stream the file from disk

  //   formData.append("file", file.buffer, {
  //     filename: file.originalname,
  //     contentType: file.mimetype,
  //   });
  console.log(file.buffer);

  formData.append(
    "image",
    new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
    file.originalname
  );

  // Build upload URL with optional folderName as query param
  let uploadUrl = UPLOAD_ENDPOINT;
  if (folder) {
    uploadUrl += `?folder=${encodeURIComponent(folder)}`;
  }

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      // ...formData.getHeaders(),
      "x-api-key": process.env.IMAGE_SERVICE_API_KEY || "",
    },
    body: formData,
  });

  if (!response.ok) {
    // throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    console.error(`Upload failed: ${response.status} ${response.statusText}`);
    // console.log("Upload failed with status:", response.status);
    
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
  const data = await response.json() as ImgServiceData;
  const imageUrl = data.url;
  if (!imageUrl) {
    // console.error("Upload response missing URL");
    console.log("data: ", data);
    
    return null;
  }
  return imageUrl as string;
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
