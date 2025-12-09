import { Router } from "express";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";

const totalsRouter = Router();

totalsRouter.get("/", async (req, res) => {
  try {
    const countResult = await handlePrismaNotFound(() =>
      prisma.$transaction([
        prisma.achievements.count(),
        prisma.announcements.count(),
        prisma.articles.count(),
        prisma.extracurriculars.count(),
        prisma.facilities.count(),
        prisma.guru.count(),
        prisma.majors.count(),
      ])
    );
    const finalMappedResult = {
      achievements: countResult[0],
      announcements: countResult[1],
      articles: countResult[2],
      extracurriculars: countResult[3],
      facilities: countResult[4],
      teachers: countResult[5],
      majors: countResult[6],
    };
    const result = {
      data: finalMappedResult,
    };
    sendData(res, result);
  } catch (error) {
    console.error("Error fetching total stats:", error);
    sendError(res, "Gagal mengambil data statistik total.");
  }
});

export default totalsRouter;
