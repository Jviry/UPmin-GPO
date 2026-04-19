/*
  Warnings:

  - Added the required column `history` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Office_email_key";

-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "history" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FeaturedPhoto" (
    "featured_photo_id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "office_id" INTEGER NOT NULL,

    CONSTRAINT "FeaturedPhoto_pkey" PRIMARY KEY ("featured_photo_id")
);

-- AddForeignKey
ALTER TABLE "FeaturedPhoto" ADD CONSTRAINT "FeaturedPhoto_office_id_fkey" FOREIGN KEY ("office_id") REFERENCES "Office"("office_id") ON DELETE RESTRICT ON UPDATE CASCADE;
