// Todo 2: tambahkan get-teacher

import { Response, Router } from "express";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { prisma } from "../../config/database/prisma";
import { paginate } from "../../types/pagination";
// import GeneralResponse from "../../utils/generalResponse";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
  const guruName = req.query.nama as string;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * pageSize;

  try {
    if (guruName) {
      // const guru = await handlePrismaNotFound(
      //   () =>
      //     prisma.guru.findMany({
      //       where: {
      //         name: {
      //           contains: guruName,
      //           mode: "insensitive",
      //         },
      //       },
      //     }),
      //   "guru not found"
      // );
      const guru = await paginate(
        // query function (receives skip and take)
        (skip, take) =>
          prisma.guru.findMany({
            where: {
              name: {
                contains: guruName,
                mode: "insensitive",
              },
            },
            skip,
            take,
          }),
        // count function
        () =>
          prisma.guru.count({
            where: {
              name: {
                contains: guruName,
                mode: "insensitive",
              },
            },
          }),
        // pagination params
        { page, pageSize }
      );
      const responseBody = { data: guru };
      sendData(res, responseBody);
      return;
    }
    const guruId = req.query.id as string;
    if (guruId) {
      const guru = await handlePrismaNotFound(
        () =>
          prisma.guru.findUnique({
            where: {
              guru_id: guruId,
            },
          }),
        "guru not found"
      );
      sendData(res, guru);
      return;
    }

    const majorId = req.query.major_id as string;
    if (majorId) {
      const guru = await paginate(
        // query function (receives skip and take)
        (skip, take) =>
          prisma.guru.findMany({
            where: { major_id: majorId },
            skip,
            take,
          }),
        // count function
        () => prisma.guru.count({ where: { major_id: majorId } }),
        // pagination params
        { page, pageSize }
      );

      sendData(res, guru);
      return;
    }

    const result = await paginate(
      // query function (receives skip and take)
      (skip, take) =>
        prisma.guru.findMany({
          skip,
          take,
        }),
      // count function
      () => prisma.guru.count(),
      // pagination params
      { page, pageSize }
    );

    // res.json(GeneralResponse.responseWithData(result.data));
    sendData(res, result);
  } catch (err) {
    console.error(err);
    // res.json(GeneralResponse.unexpectedError(err));
    sendError(res, err);
  }
});

export default router;
