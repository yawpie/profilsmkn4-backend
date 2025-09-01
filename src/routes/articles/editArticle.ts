import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkBearerToken } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
// import GeneralResponse from "../../utils/generalResponse";
import { ArticlesBodyRequest, ExtraCategoryField } from "../../types/category";
import { checkCategoryId } from "../../middleware/checkCategoryIdMiddleware";
import { bucket } from "../../config/firebase/firebase";
import { sendData, sendError } from "../../utils/send";
import {
  BadRequestError,
  UnexpectedError,
} from "../../errorHandler/responseError";
import { handlePrismaNotFound } from "../../utils/handleNotFound";

const router = Router();

router.put(
  "/:id",
  checkBearerToken,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (typeof req.body === "undefined") {
        throw new BadRequestError("Kenapa ga kirim apa apa???");
      }
      const articleId = req.params.id;
      const { title, content } = req.body;
      const category_id = req.body.category_id;
      const file = req.file;
      let imageUrl: string | null = null;
      if (file) {
        // first delete the existing image
        const url = await handlePrismaNotFound(() =>
          prisma.articles.findUnique({
            where: {
              articles_id: articleId,
            },
            select: {
              image_url: true,
            },
          })
        );
        if (url.image_url) {
          bucket.file(url.image_url).delete();
        }
        // second edit the url in the database

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
            articles_id: articleId,
          },
          select: {
            image_url: true,
          },
        });
        if (!getImageUrl) {
          throw new UnexpectedError("Image Url Problem");
        }
        imageUrl = getImageUrl.image_url;
      }
      const updatedArticle = await prisma.articles.update({
        where: {
          articles_id: articleId,
        },
        data: {
          title,
          content,
          image_url: imageUrl,
          category_id: category_id,
        },
      });
      // res.json(GeneralResponse.responseWithData(updatedArticle));
      sendData(res, updatedArticle);
    } catch (error) {
      // res.json(GeneralResponse.unexpectedError(error));
      sendError(res, error);
    }
  }
);

export default router;
