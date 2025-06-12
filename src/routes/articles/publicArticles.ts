import { Router, Request, Response } from "express";
import { prisma } from '../../config/database/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  
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
   res.json({
    data: articles,
    pagination: {
      total,
      totalPages,
      currentPage: pageRequested,
      perPage: limit,
    },
  }).status(200);

  

})

export default router;