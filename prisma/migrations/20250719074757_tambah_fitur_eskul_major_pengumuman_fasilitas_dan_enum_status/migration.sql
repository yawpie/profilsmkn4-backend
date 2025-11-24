-- CreateEnum
CREATE TYPE "status_facilities" AS ENUM ('TERSEDIA', 'PERBAIKAN', 'DIGUNAKAN');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "guru" ADD COLUMN     "nip" VARCHAR(255);

-- CreateTable
CREATE TABLE "facilities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255),
    "description" VARCHAR(255),
    "location" VARCHAR(255),
    "status" "status_facilities" NOT NULL DEFAULT 'TERSEDIA',

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "majors" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "image_url" VARCHAR(255),

    CONSTRAINT "majors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "status" "status" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extracurriculars" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255),
    "description" VARCHAR(255),
    "guru_id" UUID,

    CONSTRAINT "extracurriculars_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "extracurriculars" ADD CONSTRAINT "fk_guru" FOREIGN KEY ("guru_id") REFERENCES "guru"("guru_id") ON DELETE SET NULL ON UPDATE NO ACTION;
