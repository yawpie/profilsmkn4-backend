import { Router, Request, Response } from "express";
import { prisma } from "../../config/database/prisma";
import { AuthRequest } from "../../types/auth";
import { checkAuthWithCookie } from "../../middleware/authMiddleware";
import GeneralResponse from "../../utils/generalResponse";

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
        res.status(200).json(GeneralResponse.responseWithData(deleteArticle));

    } catch (error) {
        res.status(500).json(GeneralResponse.responseWithError(error));
    }

})

export default router;