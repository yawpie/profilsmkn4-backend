import { Router, Request, Response } from 'express';
// import { hashPassword } from '../../middleware/hashMiddleware';
import { prisma } from '../../config/database/prisma';
import GeneralResponse from '../../utils/generalResponse';
import { generateToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';
import { sendError } from '../../utils/send';
import { BadRequestError, NotFoundError } from '../../types/responseError';


const router = Router();
router.post('', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(req.body);
    if (typeof username !== "string" || typeof password !== "string") {
        res.json(GeneralResponse.badRequest("Invalid username or password"));
        return;
    }

    try {
        if (!username || !password) {
            throw new BadRequestError("Username and password are required");
        }
        const admin = await prisma.admin.findUnique({
            where: {
                username: username,
            },
        });
        if (!admin) {
            throw new NotFoundError("Admin not found");
        }
        const passwordMatch = await bcrypt.compare(password, admin.hashed_password);
        if (!passwordMatch) {
            throw new BadRequestError("Invalid password");
        }
        const token = generateToken({ adminId: admin.admin_id }, '1h');
        // res.status(200).json(GeneralResponse.defaultResponse().setData({ token: token }));
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "none" }).json({message : "success", token}).status(200);


    } catch (err) {
        console.log(err);
        // res.json(GeneralResponse.unexpectedError(err));
        sendError(res, err);
    }



});

export default router;