import { Router, Request, Response } from 'express';
import {  PrismaClient } from '../../generated/prisma/client';
import { hashPassword } from '../../middleware/hashMiddleware';
// import AuthResponse from '../../types/response';
// import GeneralResponse from '../../utils/generalResponse';
import { UnauthorizedError } from '../../types/responseError';
import { handlePrismaWrite } from '../../utils/handlePrismaWrite';
import { sendData, sendError } from '../../utils/send';


const prisma = new PrismaClient();
const router = Router();


router.post('', hashPassword, async (req: Request, res: Response) => { // the middleware "hashPassword" handle password hashing
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new UnauthorizedError("Username and password are required");
        }
        const admin = await handlePrismaWrite(() =>
            prisma.admin.create({
                data: {
                    username: username,
                    hashed_password: password,
                },
            }), "Username already exists"
        )

        // res.json(GeneralResponse.responseWithData(admin));
        sendData(res, admin);
    } catch (err) {

        // res.json(GeneralResponse.unexpectedError(err));
        sendError(res,err);
    }
});

export default router;
