import { Router } from "express";
import { handlePrismaNotFound } from "../../utils/handleNotFound";
import { prisma } from "../../config/database/prisma";
import { sendData, sendError } from "../../utils/send";

const totalsRouter = Router();

totalsRouter.get("/year", async (req, res) => {
  try {
  } catch (error) {}
});
// WIP: Get monthly post counts for a given year
async function getMonthlyPostCounts(year: number) {
  // Parameterized query to avoid injection
  // const rows = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
  //   SELECT
  //   EXTRACT(MONTH FROM "publishDate") AS month,
  //   COUNT(*)::bigint AS count
  //   FROM "Post"
  //   WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
  //   GROUP BY month
  //   ORDER BY month;
  //   `;
  // // Build an array of 12 months (1..12) filling zeros where missing
  // const counts = Array.from({ length: 12 }, (_, i) => {
  //   const m = i + 1;
  //   const row = rows.find((r) => r.month === m);
  //   return { month: m, count: Number(row?.count ?? 0) };
  // });

  // return counts; // [{month:1,count:...}, ..., {month:12,count:...}]
}
export default totalsRouter;
