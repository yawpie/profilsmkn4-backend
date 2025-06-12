import { Router, Request, Response } from "express";
import { ArticleRequest, AuthRequest, authToken } from "../../middleware/authMiddleware";
import { prisma } from "../../config/database/prisma";
import { upload } from "../../middleware/uploadMiddleware";
import { bucket } from "../../config/firebase/firebase";
import GeneralResponse from "../../utils/generalResponse";

const router: Router = Router();

router.post("/", authToken, upload.single("image"), async (req: AuthRequest, res: Response) => {

    try {
        if (!req.admin?.adminId) {
            throw new Error("Admin not found");
        }
        const { title, content, category_id } = req.body;
        const file = req.file;

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
        }

        const article = await prisma.articles.create({
            data: {
                title,
                content,
                category_id,
                image_url: imageUrl,
                admin_id: req.admin?.adminId,
            },
        });
        res.status(201).json(GeneralResponse.responseWithData(article));

    } catch (error) {
        console.error(error);
        res.status(500).json(GeneralResponse.responseWithError(error));
    }


});

export default router;