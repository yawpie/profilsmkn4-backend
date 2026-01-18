import { Prisma } from "../generated/prisma";
import HttpError from "../errorHandler/responseError";
import { logger } from "./logger";
import { randomUUID } from "crypto";

// export async function handlePrismaWrite<T>(
//     fn: () => Promise<T>,
//     defaultMessage = 'Failed to perform write operation'
// ): Promise<T> {
//     try {
//         return await fn();
//     } catch (error) {
//         if (error instanceof Prisma.PrismaClientKnownRequestError) {
//             switch (error.code) {
//                 case 'P2002': // Unique constraint failed

//                     throw new HttpError('Duplicate value', 400);
//                 case 'P2003': // Foreign key constraint failed

//                     throw new HttpError("Foreign key constraint failed", 400);
//                 case 'P2004': // DB constraint failed (usually with raw SQL)

//                     throw new HttpError('A database constraint failed', 400);
//                 // Add more cases as needed based on your application's needs

//                 default:
//                     throw new HttpError(`${defaultMessage}: ${error.message}`, 500);
//             }
//         }
//         throw error; // unknown error, rethrow
//     }
// }

export async function handlePrismaWrite<T>(
  fn: () => Promise<T>,
  defaultMessage?: string,
  options?: {
    traceId?: string;
    operation?: string;
  }
): Promise<T> {
  const traceId = options?.traceId ?? randomUUID();
  const operation = options?.operation ?? "prisma-write";
  const start = Date.now();

  logger.info("Transaction started", { traceId, operation });

  try {
    const result = await fn();

    logger.info("Transaction committed", {
      traceId,
      operation,
      durationMs: Date.now() - start,
    });

    return result;
  } catch (error) {
    logger.error("Transaction failed", {
      traceId,
      operation,
      durationMs: Date.now() - start,
      error,
    });

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new HttpError("Invalid data provided", 400);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new HttpError("Duplicate value", 400);
        case "P2003":
          throw new HttpError("Foreign key constraint failed", 400);
        case "P2004":
          throw new HttpError("A database constraint failed", 400);
        default:
          throw new HttpError(defaultMessage ?? "Database error", 500);
      }
    }

    throw error;
  }
}
