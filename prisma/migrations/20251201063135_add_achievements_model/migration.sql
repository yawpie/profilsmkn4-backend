-- CreateTable
CREATE TABLE "achievements" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" VARCHAR(255),

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);
