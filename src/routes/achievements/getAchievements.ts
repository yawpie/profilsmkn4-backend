import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { paginate } from "../../types/pagination";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const achievementId = req.query.id as string;

  try {
    // Case 1: If `id` is provided, return a specific achievement
    if (achievementId) {
      const achievement = await handlePrismaNotFound(
        () =>
          prisma.achievements.findUnique({
            where: {
              id: achievementId,
            },
          }),
        "Achievement not found"
      );

      const responseBody = {
        id: achievement.id,
        title: achievement.title,
        publishDate: achievement.publishDate.toISOString(),
        description: achievement.description,
        content: achievement.content,
        image: achievement.image_url,
      };

      sendData(res, responseBody);
      return;
    }

    // Case 2: If `id` is not provided, return paginated list
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 10;

    const result = await paginate(
      // query function (receives skip and take)
      (skip, take) =>
        prisma.achievements.findMany({
          skip,
          take,
          orderBy: { publishDate: "desc" },
        }),
      // count function
      () => prisma.achievements.count(),
      // pagination params
      { page, pageSize }
    );

    // Map to frontend contract
    const mappedData = {
      data: result.data.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        publishDate: achievement.publishDate.toISOString(),
        description: achievement.description,
        content: achievement.content,
        image: achievement.image_url,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      hasMore: result.hasMore,
    };

    sendData(res, result);
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
