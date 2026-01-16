import { Router, Response } from "express";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";
import { paginate } from "../../types/pagination";
import { title } from "process";

const router = Router();
export type MajorApiResponse = {
  id: string;
  name: string;
  description: string;
  image_cover: string | null;
  guru_list : {
    guru_id: string;
    name: string;
    jabatan: string;
    nip: string | null;
    image_url: string | null;
    mata_pelajaran: string | null;
  }[];
  images_list: {
    id: string;
    image_url: string | null;
  }[]
};
 

router.get(
  "/",
  // checkAccessWithCookie,
  async (req: AuthRequest, res: Response) => {
    const eskulName = req.query.name as string;
    const selected = {
      id: true,
      name: true,
      description: true,
      image_url: true,
      guru: true,
      major_gallery_images: {
        select: {
          id: true,
          title: true,
          image_url: true,
        },
      },
    };
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
              select: selected,
            }),
          "Major not found"
        );
        sendData(res, eskul);
        return;
      }

      const id = req.query.id as string;
      if (id) {
        const major = await handlePrismaNotFound(
          () =>
            prisma.majors.findUnique({
              where: {
                id: id,
              },
              select: selected,
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
            select: selected,
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

router.get(
  "/simple",
  // checkAccessWithCookie,
  async (req: AuthRequest, res: Response) => {
    try {
      const majors = await prisma.majors.findMany({ 
        select: {
          id: true,
          name: true,
        } 
      });
      const result = {
        data: majors,
      };
      sendData(res, result);
    } catch (err) {
      console.error(err);
      sendError(res, err);
    }
  }
);

export default router;
