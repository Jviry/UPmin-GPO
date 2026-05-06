/*
  Warnings:

  - You are about to drop the column `college_id` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `head` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `university_graduated` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the `College` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_college_id_fkey";

-- DropForeignKey
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_department_id_fkey";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "college_id",
DROP COLUMN "head";

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "department_id",
DROP COLUMN "university_graduated";

-- DropTable
DROP TABLE "College";

-- CreateTable
CREATE TABLE "FacultyCredential" (
    "credential_id" SERIAL NOT NULL,
    "degree" TEXT NOT NULL,
    "faculty_id" INTEGER NOT NULL,

    CONSTRAINT "FacultyCredential_pkey" PRIMARY KEY ("credential_id")
);

-- AddForeignKey
ALTER TABLE "FacultyCredential" ADD CONSTRAINT "FacultyCredential_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("faculty_id") ON DELETE CASCADE ON UPDATE CASCADE;
