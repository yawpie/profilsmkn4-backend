import { Router, Response } from "express";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";
import { prisma } from "../../config/database/prisma";
import { upload } from "../../middleware/uploadMiddleware";
import { bucket } from "../../config/firebase/firebase";
import { checkCategoryId } from "../../middleware/checkCategoryIdMiddleware";
import { ArticlesBodyRequest, ExtraCategoryField } from "../../types/category";
import { BadRequestError } from "../../errorHandler/responseError";
import { sendData, sendError } from "../../utils/send";
import { uploadImageToFirebase } from "../../utils/firebaseHandler";

const router: Router = Router();

router.post("/", checkAuthWithCookie, upload.single("image"), checkCategoryId, async (req: AuthRequest<ArticlesBodyRequest, any, any, ExtraCategoryField>, res: Response) => {

    try {
        // if (!req.admin?.adminId) {
        //     throw new BadRequestError("");
        // }

        const { title, content } = req.body;
        const category_id = req.category_id;
        const file = req.file;
        // let imageUrl: string | null = null;

        // if (file) {
        //     const fileName = `articles/${Date.now()}_${file.originalname}`;
        //     const fileRef = bucket.file(fileName);

        //     await fileRef.save(file.buffer, {
        //         contentType: file.mimetype,
        //         public: true,
        //         metadata: {
        //             firebaseStorageDownloadTokens: fileName,
        //         },
        //     });

        //     imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        // } else {
        //     throw new BadRequestError("Image is required");
        // }
        const imageUrl = await uploadImageToFirebase(file, "articles");

        const article = await prisma.articles.create({
            data: {
                title,
                content,
                category_id,
                image_url: imageUrl,
                admin_id: req.admin?.adminId,
            },
        });
        // res.json(GeneralResponse.responseWithData(article));
        sendData(res, article);
    } catch (error) {
        sendError(res, error);
    }

});

export default router;