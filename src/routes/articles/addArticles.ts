import { Router, Response } from "express";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";
import { prisma } from "../../config/database/prisma";
import { upload } from "../../middleware/uploadMiddleware";
// import { bucket } from "../../config/firebase/firebase";
// import { checkCategoryId } from "../../middleware/checkCategoryIdMiddleware";
import { ArticlesBodyRequest, ExtraCategoryField } from "../../types/category";
// import { BadRequestError } from "../../errorHandler/responseError";
import { sendData, sendError } from "../../utils/send";
// import { uploadImageToFirebase } from "../../utils/firebaseHandler";
import { uploadImage } from "../../utils/imageServiceHandler";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";
import { slugify } from "../../utils/slugify";

const router: Router = Router();

router.post(
  "/",
  checkAccessWithCookie,
  upload.single("image"),
  async (req: AuthRequest<ArticlesBodyRequest>, res: Response) => {
    try {
      // if (!req.admin?.adminId) {
      //     throw new BadRequestError("");
      // }

      const { title, content } = req.body;
      console.log(req.body);
      const tags =
        typeof req.body.tags === "string"
          ? (JSON.parse(req.body.tags || "[]") as string[])
          : req.body.tags || [];

      // const category_id = req.category_id;
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
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImage(file, "articles");
      }

      // const article = await handlePrismaWrite(()=>
      //   prisma.articles.create({
      //   data: {
      //     title,
      //     content,
      //     // category_id,
      //     image_url: imageUrl,
      //     admin_id: req.admin?.adminId,
      //     slug: title.toLowerCase().replace(/ /g, "-"),
      //     status: req.body.status,
      //   },
      // }))

      await handlePrismaWrite(
        async () =>
          await prisma.$transaction(async (tx) => {
            const tagNames = tags?.map((name) => name.trim()) || [];
            const slugs = tagNames?.map((name) => slugify(name));

            const existingTags = await tx.tags.findMany({
              where: {
                slug: { in: slugs },
              },
            });
            const existingSlugSet = new Set(existingTags.map((t) => t.slug));

            const newTags = slugs
              .filter((slug) => !existingSlugSet.has(slug))
              .map((slug, i) => ({
                name: tagNames[i],
                slug,
              }));

            if (newTags.length > 0) {
              await tx.tags.createMany({
                data: newTags,
              });
            }

            const allTags = await tx.tags.findMany({
              where: {
                slug: { in: slugs },
              },
            });
            const newArticle = await tx.articles.create({
              data: {
                title,
                content,
                image_url: imageUrl,
                admin: { connect: { admin_id: req.admin?.adminId } },
                slug: slugify(title),
                status: req.body.status,
              },
            });

            await tx.articles_tags.createMany({
              data: allTags.map((tag) => ({
                articles_id: newArticle.articles_id,
                tag_id: tag.id,
              })),
              skipDuplicates: true,
            });
            sendData(res, { data: newArticle.articles_id });
          }),
        "Failed to create article"
      );

      // res.json(GeneralResponse.responseWithData(article));
    } catch (error) {
      sendError(res, error);
    }
  }
);

export default router;
