import { Router, Request, Response } from "express";
import { prisma } from '../../config/database/prisma';
// import GeneralResponse from "../../utils/generalResponse";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { paginate } from "../../types/pagination";
import { sendData, sendError } from "../../utils/send";
import { send } from "process";

const router = Router();

// router.get('/', async (req: Request, res: Response) => {

//     const pageRequested = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (pageRequested - 1) * limit;

//     const [total, articles] = await Promise.all([
//     prisma.articles.count(),
//     prisma.articles.findMany({
//       skip,
//       take: limit,
//     }),
//   ]);

//    const totalPages = Math.ceil(total / limit);
//    res.json({
//     data: articles,
//     pagination: {
//       total,
//       totalPages,
//       currentPage: pageRequested,
//       perPage: limit,
//     },
//   }).status(200);
// })

// router.get("/", checkAuthWithCookie, async (req: AuthRequest, res: Response) => {

//     const articles_title = req.query.article_title as string;

//     if (!articles_title) {
//         res.status(400).json(GeneralResponse.responseWithError("Article title is required"));
//         return;
//     }
//     const article = await prisma.articles.findFirst({
//         where: {
//             title: articles_title
//         }
//     });
//     if (!article) {
//         res.status(404).json(GeneralResponse.responseWithError("Article not found"));
//         return;
//     }
//     res.status(200).json(GeneralResponse.responseWithData(article));
// });
// ! warning: might error in pagination
router.get('/', async (req: Request, res: Response) => {
  const articleTitle = req.query.title as string;

  try {
    // Case 1: If `article_title` is provided, return a specific article
    if (articleTitle) {
      const article = await handlePrismaNotFound(() =>
        prisma.articles.findFirst({
          where: {
            title: {
              contains: articleTitle,
              mode: 'insensitive',
            },
          },
        }), "Article not found"
      )
      // res.status(200).json(GeneralResponse.responseWithData(article));
      sendData(res, article);
      return;
    }

    // Case 2: If `article_title` is not provided, return paginated list
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * pageSize;

    const result = await paginate(
      // query function (receives skip and take)
      (skip, take) =>
        prisma.articles.findMany({
          skip,
          take,
          select: {
            articles_id: true,
            content: true,
            image_url: true,
            published_date: true,
            admin: { select: { username: true } },
            category: { select: { name: true } },
            title: true
          }
        }),
      // count function
      () => prisma.articles.count(),
      // pagination params
      { page, pageSize }
    );

    // res.json(GeneralResponse.responseWithData(result));
    sendData(res, result);

  } catch (error) {
    // res.json(GeneralResponse.unexpectedError(error));
    sendError(res, error);
  }

});

export default router;