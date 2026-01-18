import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/uploadMiddleware";
import { sendData, sendError } from "../../utils/send";
import {
  BadRequestError,
  UnexpectedError,
} from "../../errorHandler/responseError";
import { deleteImage, uploadImage } from "../../utils/imageServiceHandler";
import { handlePrismaNotFound } from "../../utils/handleNotFound";

const router = Router();

router.put(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (typeof req.body === "undefined") {
        throw new BadRequestError("Kenapa ga kirim apa apa???");
      }
      const articleId = req.query.id;
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
          // bucket.file(url.image_url).delete();
          deleteImage(url.image_url)
        }
        // second edit the url in the database

        const fileName = `articles/${Date.now()}_${file.originalname}`;
        // const fileRef = bucket.file(fileName);

        // await fileRef.save(file.buffer, {
        //   contentType: file.mimetype,
        //   public: true,
        //   metadata: {
        //     firebaseStorageDownloadTokens: fileName,
        //   },
        // });

        imageUrl = await uploadImage(file, "articles");
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
          // TODO Tags harus bisa diedit
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
