-- AlterTable
ALTER TABLE "guru" ADD COLUMN     "major_id" UUID,
ADD COLUMN     "mata_pelajaran" VARCHAR(255);

-- CreateTable
CREATE TABLE "major_gallery_images" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "major_id" UUID NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "major_gallery_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "fk_major" FOREIGN KEY ("major_id") REFERENCES "majors"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "major_gallery_images" ADD CONSTRAINT "fk_major_gallery_images" FOREIGN KEY ("major_id") REFERENCES "majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
