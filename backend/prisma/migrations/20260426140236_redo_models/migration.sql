/*
  Warnings:

  - You are about to drop the column `contact_info` on the `College` table. All the data in the column will be lost.
  - You are about to drop the column `college_id` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `contact_info` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `application_process` on the `GraduateProgram` table. All the data in the column will be lost.
  - You are about to drop the column `college_id` on the `GraduateProgram` table. All the data in the column will be lost.
  - You are about to drop the `DownloadableResource` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `department_id` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `university_graduated` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `application_instructions` to the `GraduateProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `GraduateProgram` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DownloadableResource" DROP CONSTRAINT "DownloadableResource_program_id_fkey";

-- DropForeignKey
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_college_id_fkey";

-- DropForeignKey
ALTER TABLE "GraduateProgram" DROP CONSTRAINT "GraduateProgram_college_id_fkey";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "attached_link" TEXT,
ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "College" DROP COLUMN "contact_info";

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "college_id",
DROP COLUMN "contact_info",
ADD COLUMN     "department_id" INTEGER NOT NULL,
ADD COLUMN     "university_graduated" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GraduateProgram" DROP COLUMN "application_process",
DROP COLUMN "college_id",
ADD COLUMN     "application_instructions" TEXT NOT NULL,
ADD COLUMN     "department_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "DownloadableResource";

-- CreateTable
CREATE TABLE "Scholarship" (
    "scholarship_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "covered_programs" TEXT NOT NULL,
    "application_instructions" TEXT NOT NULL,
    "application_url" TEXT NOT NULL,
    "recommendation_url" TEXT,
    "contact_info" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("scholarship_id")
);

-- CreateTable
CREATE TABLE "Testimony" (
    "testimony_id" SERIAL NOT NULL,
    "alumnus_photo" TEXT NOT NULL,
    "alumnus_name" TEXT NOT NULL,
    "testimony_description" TEXT NOT NULL,
    "alumnus_graduate_program" TEXT NOT NULL,

    CONSTRAINT "Testimony_pkey" PRIMARY KEY ("testimony_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "department_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "head" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "college_id" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_contact_info_key" ON "Scholarship"("contact_info");

-- CreateIndex
CREATE UNIQUE INDEX "Department_contact_info_key" ON "Department"("contact_info");

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("college_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduateProgram" ADD CONSTRAINT "GraduateProgram_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;
