import { Router, Request, Response } from 'express';
import { hashPassword } from '../../middleware/hashMiddleware';
import { authToken } from '../../middleware/authMiddleware';
import { prisma } from '../../config/database/prisma';
import GeneralResponse from '../../utils/generalResponse';
import { generateToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';


const router = Router();
router.post('', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
        res.status(400).json(GeneralResponse.failedResponse("Invalid username or password"));
        return;
    }

    if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                username: username,
            },
        });
        if (!admin) {
            throw new Error("Admin not found");
        }
        const passwordMatch = await bcrypt.compare(password, admin.hashed_password);
        if (!passwordMatch) {
            throw new Error("Invalid password");
        }
        const token = generateToken({ adminId: admin.admin_id }, '1h');
        res.status(200).json(GeneralResponse.defaultResponse().setData({ token: token }));



    } catch (err) {
        console.log(err);
        res.status(400).json(GeneralResponse.failedResponse("Something went wrong").setData({ error: err }));

    }



});

export default router;