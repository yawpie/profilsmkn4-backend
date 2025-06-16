import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import GeneralResponse from "../../utils/generalResponse";
import { CategoryBody, ExtraCategoryField } from "../../types/category";
import { checkCategoryId } from "../../middleware/checkCategoryIdMiddleware";
import { bucket } from "../../config/firebase/firebase";

const router = Router();



router.put("/:id", checkAuthWithCookie, upload.single("image"), checkCategoryId, async (req: AuthRequest<CategoryBody, any, any, ExtraCategoryField>, res: Response) => {
    const articleId = req.params.id
    const { title, content } = req.body;
    const category_id = req.category_id
    const file = req.file;
    try {

        let imageUrl: string | null = null;
        if (file) {
            const fileName = `articles/${Date.now()}_${file.originalname}`;
            const fileRef = bucket.file(fileName);

            await fileRef.save(file.buffer, {
                contentType: file.mimetype,
                public: true,
                metadata: {
                    firebaseStorageDownloadTokens: fileName,
                },
            });

            imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        } else {
            // search for the imageurl if the image is not sent
            const getImageUrl = await prisma.articles.findFirst({
                where: {
                    articles_id: articleId
                },
                select: {
                    image_url: true
                }
            })
            if (!getImageUrl) { throw new Error("Image Url Problem") }
            imageUrl = getImageUrl.image_url
        }
        const updatedArticle = await prisma.articles.update({
            where: {
                articles_id: articleId
            },
            data: {
                title,
                content,
                image_url: imageUrl,
                category_id: category_id
            }
        })

    } catch (error) {
        res.status(500).json(GeneralResponse.responseWithError(error));
    }




})

export default router;