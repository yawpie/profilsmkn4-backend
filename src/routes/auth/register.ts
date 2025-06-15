import { Router, Request, Response } from 'express';
import { Prisma, PrismaClient } from '../../generated/prisma/client';
import { hashPassword } from '../../middleware/hashMiddleware';
import AuthResponse from '../../types/response';
import GeneralResponse from '../../utils/generalResponse';
import ResponseError from '../../types/responseError';


const prisma = new PrismaClient();
const router = Router();


router.post('', hashPassword, async (req: Request, res: Response) => { // the middleware "hashPassword" handle password hashing
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json(
                GeneralResponse.responseWithMessage("Username and password are required")
            );
        }
        const admin = await prisma.admin.create({
            data: {
                username: username,
                hashed_password: password,
            },
        })

        res.status(201).json(GeneralResponse.defaultResponse().setData({ admin: admin }));
    } catch (err) {
        if (err instanceof ResponseError) {
            res.status(500).json(GeneralResponse.responseWithError(err));
        } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Known error:", err.code, err.message);

            if (err.code === 'P2002') {
                console.error("Unique constraint failed on field:", err.meta?.target);
                res.status(400).json(GeneralResponse.responseWithError("Username already exists"));
                return;
            }
        }
        else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            // Unknown request error
            console.error("Unknown request error:", err);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            // Validation error in your data
            console.error("Validation error:", err.message);
        } else {
            // Some other unexpected error
            console.error("Unexpected error:", err);
        }
        // else {
        //     // const error = new ResponseError("Something went wrong during admin creation", "AuthError");
        //     res.status(500).json(GeneralResponse.responseWithError(err));
        // }
        res.status(500).json(GeneralResponse.responseWithError(err));
    }
});

export default router;
