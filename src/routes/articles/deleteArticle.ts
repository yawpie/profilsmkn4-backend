import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import { sendData, sendError } from "../../utils/send";
// import GeneralResponse from "../../utils/generalResponse";

const router = Router();

router.delete("/:id", checkAuthWithCookie, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Invalid id");
        }

        const deleteArticle = await prisma.articles.delete({
            where: {
                articles_id: id
            }
        })
        // res.json(GeneralResponse.responseWithData(deleteArticle));
        sendData(res, deleteArticle);

    } catch (error) {
        // res.json(GeneralResponse.unexpectedError(error));
        sendError(res, error);
    }

})

export default router;