import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const password = req.body?.password;
        if (!password) {
            throw new Error('Password is required');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;

        next();
    } catch (err) {
        console.error('Error hashing password: ', err);
        res.status(400).json({ error: err });
    }
};
