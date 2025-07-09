import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { BadRequestError, NotFoundError } from "../../errorHandler/responseError";
import { bucket } from "../../config/firebase/firebase";
import { deleteFirebaseFile } from "../../utils/firebaseHandler";
// import GeneralResponse from "../../utils/generalResponse";

const router = Router();

router.delete("/:id", checkAuthWithCookie, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError("Invalid id");
        }
        const imageUrl = await handlePrismaNotFound(() =>
            prisma.articles.findUnique({
                where: {
                    articles_id: id
                },
                select: {
                    image_url: true
                }
            })
        )


        const deleteArticle = await handlePrismaNotFound(() => prisma.articles.delete({
            where: {
                articles_id: id
            }
        }))
        console.log("deleteArticle: ", imageUrl);
        
        if (imageUrl.image_url) {
            deleteFirebaseFile(imageUrl.image_url);
        }

        sendData(res, deleteArticle);
    } catch (error) {
        sendError(res, error);
    }

})

export default router;