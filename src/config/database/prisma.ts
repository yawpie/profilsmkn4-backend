import { PrismaClient } from '../../generated/prisma/client';
import { config } from "dotenv";

// if (process.env.NODE_ENV === "test") {
    // config({ path: ".env.test" });
// } else {
//     config();
// }


export const prisma = new PrismaClient();