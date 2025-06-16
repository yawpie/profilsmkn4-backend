import { Router, Request, Response } from "express";
import { prisma } from '../../config/database/prisma';
import GeneralResponse from "../../utils/generalResponse";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";

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

router.get('/', async (req: Request, res: Response) => {
  const articleTitle = req.query.article_title as string;

  // Case 1: If `article_title` is provided, return a specific article
  if (articleTitle) {
    const article = await prisma.articles.findFirst({
      where: {
        title: articleTitle,
      },
    });

    if (!article) {
      res.status(404).json(GeneralResponse.responseWithError("Article not found"));
      return;
    }

    res.status(200).json(GeneralResponse.responseWithData(article));
    return;
  }

  // Case 2: If `article_title` is not provided, return paginated list
  const pageRequested = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (pageRequested - 1) * limit;

  const [total, articles] = await Promise.all([
    prisma.articles.count(),
    prisma.articles.findMany({
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    data: articles,
    pagination: {
      total,
      totalPages,
      currentPage: pageRequested,
      perPage: limit,
    },
  });
  return;
});

export default router;