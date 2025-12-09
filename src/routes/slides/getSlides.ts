import { Router, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";
import { AuthRequest } from "../../types/auth";
import { handlePrismaNotFound } from "../../utils/handleNotFound";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    // const slides = await prisma.slides.findMany({
    //   orderBy: { order: "asc" },
    // });
    const slides = await handlePrismaNotFound(() =>
      prisma.slides.findMany({
        orderBy: { order: "asc" },
        
      })
    );
    let slidesData = {data: slides};

    // const mapped = slides.map((slide) => ({
    //   id: slide.id,
    //   image_url: slide.image_url,
    //   alt: slide.alt,
    //   title: slide.title,
    //   subtitle: slide.subtitle,
    //   description: slide.description,
    //   gradientFrom: slide.gradientFrom,
    //   gradientTo: slide.gradientTo,
    //   order: slide.order,
    //   isActive: slide.isActive,
    // }));
    // console.log(mapped);
    
    sendData(res, slidesData);
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
