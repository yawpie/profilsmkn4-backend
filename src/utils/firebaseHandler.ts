import { bucket } from "../config/firebase/firebase";
import { BadRequestError, FirebaseError } from "../errorHandler/responseError";
/**
 * @deprecated use deleteImage from imageServiceHandler.ts
 * @param url 
 */
export async function deleteFirebaseFile(url: string) {
  const storagePath = new URL(url).pathname.replace(/^\/[^/]+\//, "");

  try {
    await bucket.file(storagePath).delete();
    console.log(`Deleted: ${storagePath}`);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
}

/**
 * Upload an image to Firebase Storage
 * @param file The image file to upload
 * @param folderName The folder name in Firebase Storage
 * @returns The download URL of the uploaded image
 * @deprecated use uploadImage from imageServiceHandler.ts
 */
export async function uploadImageToFirebase(
  file: Express.Multer.File | undefined | null,
  folderName: string
): Promise<string> {
  try {
    if (!file) {
      throw new BadRequestError("Image is required");
    }

    const fileName = `${folderName}/${Date.now()}_${file.originalname}`;
    const fileRef = bucket.file(fileName);

    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      public: true,
      metadata: {
        firebaseStorageDownloadTokens: fileName,
      },
    });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    return imageUrl;
  } catch (error) {
    console.log("Error uploading image:", error);
    throw new FirebaseError("Failed to upload image to Firebase");
  }
}
