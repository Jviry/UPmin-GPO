/*
  Warnings:

  - You are about to drop the column `department_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `program_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `program_id` on the `ProgramCourse` table. All the data in the column will be lost.
  - You are about to drop the `ElectivePool` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `year` on table `ProgramCourse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `semester` on table `ProgramCourse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `study_plan_id` on table `ProgramCourse` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_department_id_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_program_id_fkey";

-- DropForeignKey
ALTER TABLE "ElectivePool" DROP CONSTRAINT "ElectivePool_course_id_fkey";

-- DropForeignKey
ALTER TABLE "ElectivePool" DROP CONSTRAINT "ElectivePool_study_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "ProgramCourse" DROP CONSTRAINT "ProgramCourse_program_id_fkey";

-- DropForeignKey
ALTER TABLE "ProgramCourse" DROP CONSTRAINT "ProgramCourse_study_plan_id_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "department_id",
DROP COLUMN "program_id";

-- AlterTable
ALTER TABLE "ProgramCourse" DROP COLUMN "program_id",
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "semester" SET NOT NULL,
ALTER COLUMN "study_plan_id" SET NOT NULL;

-- DropTable
DROP TABLE "ElectivePool";

-- CreateTable
CREATE TABLE "CoursePool" (
    "course_pool_id" SERIAL NOT NULL,
    "course_pool_name" TEXT NOT NULL,
    "program_id" INTEGER NOT NULL,

    CONSTRAINT "CoursePool_pkey" PRIMARY KEY ("course_pool_id")
);

-- CreateTable
CREATE TABLE "CoursePoolEntry" (
    "entry_id" SERIAL NOT NULL,
    "course_pool_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "CoursePoolEntry_pkey" PRIMARY KEY ("entry_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoursePoolEntry_course_pool_id_course_id_key" ON "CoursePoolEntry"("course_pool_id", "course_id");

-- AddForeignKey
ALTER TABLE "CoursePool" ADD CONSTRAINT "CoursePool_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePoolEntry" ADD CONSTRAINT "CoursePoolEntry_course_pool_id_fkey" FOREIGN KEY ("course_pool_id") REFERENCES "CoursePool"("course_pool_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePoolEntry" ADD CONSTRAINT "CoursePoolEntry_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "StudyPlan"("study_plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;
