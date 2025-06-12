/*
  Warnings:

  - You are about to drop the column `status` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "status";

-- DropEnum
DROP TYPE "article_status";

-- CreateTable
CREATE TABLE "guru" (
    "guru_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "jabatan" VARCHAR(255) NOT NULL,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("guru_id")
);
