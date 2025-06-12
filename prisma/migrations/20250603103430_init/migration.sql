-- CreateEnum
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "article_status" AS ENUM ('draft', 'published', 'archived');

-- CreateTable
CREATE TABLE "admin" (
    "admin_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" VARCHAR(255) NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "articles" (
    "articles_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255),
    "status" "article_status" DEFAULT 'draft',
    "published_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "admin_id" UUID,
    "category_id" UUID,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("articles_id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateIndex
CREATE INDEX "idx_articles_admin" ON "articles"("admin_id");

-- CreateIndex
CREATE INDEX "idx_articles_category" ON "articles"("category_id");

-- CreateIndex
CREATE INDEX "idx_articles_published_date" ON "articles"("published_date");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "fk_admin" FOREIGN KEY ("admin_id") REFERENCES "admin"("admin_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "fk_category" FOREIGN KEY ("category_id") REFERENCES "category"("category_id") ON DELETE SET NULL ON UPDATE NO ACTION;
