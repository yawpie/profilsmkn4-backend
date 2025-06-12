import { Router, Request, Response } from 'express';
import { authToken } from '../../middleware/authMiddleware';
import { PrismaClient } from '../../generated/prisma/client';
import { hashPassword } from '../../middleware/hashMiddleware';
import AuthResponse from '../../utils/response';
import GeneralResponse from '../../utils/generalResponse';
import ResponseError from '../../utils/responseError';

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
    } else {
      const error = new ResponseError("Something went wrong during admin creation", "AuthError");
      res.status(500).json(GeneralResponse.responseWithError(error));
    }
  }
});

export default router;
