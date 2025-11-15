import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { BadRequestError } from "../../errorHandler/responseError";
import { sendData, sendError } from "../../utils/send";
import { AuthRequest } from "../../types/auth";
import { handlePrismaWrite } from "../../utils/handlePrismaWrite";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { AnnouncementsRequestBody } from "../../types/announcements";

const router: Router = Router();

router.post(
  "/",
  checkAccessWithCookie,
  async (req: AuthRequest<AnnouncementsRequestBody>, res: Response) => {
    try {
      const { title, content, date, status } = req.body;
      if (!title || !content || !date || !status) {
        throw new BadRequestError("Title are required");
      }

      const create = await handlePrismaWrite(() =>
        prisma.announcements.create({
          data: {
            title,
            content,
            status,
            date,
          },
        })
      );
      sendData(res, create);
    } catch (err) {
      sendError(res, err);
    }
  }
);

export default router;
