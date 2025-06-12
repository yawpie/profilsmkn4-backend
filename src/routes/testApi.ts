import { Request, Response } from "express";
import { Router } from "express";
import GeneralResponse from "../utils/generalResponse";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json(GeneralResponse.defaultResponse());
})

export default router;