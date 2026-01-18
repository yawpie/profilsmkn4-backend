/*
  Warnings:

  - You are about to drop the column `category_id` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "fk_category";

-- DropIndex
DROP INDEX "idx_articles_category";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "category_id",
ADD COLUMN     "tagsId" UUID;

-- DropTable
DROP TABLE "category";

-- CreateTable
CREATE TABLE "articles_tags" (
    "articles_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "pk_articles_tags" PRIMARY KEY ("articles_id","tag_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_articles_tags_tag" ON "articles_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- AddForeignKey
ALTER TABLE "articles_tags" ADD CONSTRAINT "fk_articles_tags_articles" FOREIGN KEY ("articles_id") REFERENCES "articles"("articles_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articles_tags" ADD CONSTRAINT "fk_articles_tags_tags" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
