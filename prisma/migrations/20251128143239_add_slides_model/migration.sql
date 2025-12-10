-- CreateTable
CREATE TABLE "slides" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "image_url" VARCHAR(255) NOT NULL,
    "alt" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "gradientFrom" VARCHAR(255) NOT NULL,
    "gradientTo" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "slides_pkey" PRIMARY KEY ("id")
);
