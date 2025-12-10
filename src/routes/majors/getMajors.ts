import { Router, Response } from "express";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";
import { paginate } from "../../types/pagination";

const router = Router();

router.get(
  "/",
  // checkAccessWithCookie,
  async (req: AuthRequest, res: Response) => {
    const eskulName = req.query.name as string;

    try {
      if (eskulName) {
        const eskul = await handlePrismaNotFound(
          () =>
            prisma.majors.findMany({
              where: {
                name: {
                  contains: eskulName,
                  mode: "insensitive",
                },
              },
            }),
          "Extracurricular not found"
        );
        sendData(res, eskul);
        return;
      }

      const id = req.query.id as string;
      if (id) {
        const major = await handlePrismaNotFound(
          () =>
            prisma.majors.findMany({
              where: {
                id: id,
              },
            }),
          "Major not found"
        );
        sendData(res, major);
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * pageSize;

      const result = await paginate(
        // query function (receives skip and take)
        (skip, take) =>
          prisma.majors.findMany({
            skip,
            take,
          }),
        // count function
        () => prisma.majors.count(),
        // pagination params
        { page, pageSize }
      );

      sendData(res, result);
    } catch (err) {
      console.error(err);
      // res.json(GeneralResponse.unexpectedError(err));
      sendError(res, err);
    }
  }
);

export default router;
