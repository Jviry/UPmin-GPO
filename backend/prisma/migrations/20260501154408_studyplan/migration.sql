/*
  Warnings:

  - You are about to drop the column `dean` on the `College` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `contact_info` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `objectives` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the `GraduateProgram` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `current_dean` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `core_values` to the `Office` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mission` to the `Office` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Office` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vision` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GraduateProgram" DROP CONSTRAINT "GraduateProgram_department_id_fkey";

-- DropForeignKey
ALTER TABLE "ProgramCourse" DROP CONSTRAINT "ProgramCourse_course_id_fkey";

-- DropForeignKey
ALTER TABLE "ProgramCourse" DROP CONSTRAINT "ProgramCourse_program_id_fkey";

-- AlterTable
ALTER TABLE "College" DROP COLUMN "dean",
ADD COLUMN     "current_dean" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "description",
ADD COLUMN     "department_id" INTEGER;

-- AlterTable
ALTER TABLE "Office" DROP COLUMN "contact_info",
DROP COLUMN "location",
DROP COLUMN "name",
DROP COLUMN "objectives",
ADD COLUMN     "core_values" TEXT NOT NULL,
ADD COLUMN     "mission" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "vision" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProgramCourse" ADD COLUMN     "is_elective_slot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_placed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "study_plan_id" INTEGER,
ALTER COLUMN "course_id" DROP NOT NULL,
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "semester" DROP NOT NULL;

-- DropTable
DROP TABLE "GraduateProgram";

-- CreateTable
CREATE TABLE "Program" (
    "program_id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "application_instructions" TEXT NOT NULL,
    "application_url" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "StudyPlan" (
    "study_plan_id" SERIAL NOT NULL,
    "years" INTEGER NOT NULL,
    "program_id" INTEGER NOT NULL,

    CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("study_plan_id")
);

-- CreateTable
CREATE TABLE "ElectivePool" (
    "elective_pool_id" SERIAL NOT NULL,
    "study_plan_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "ElectivePool_pkey" PRIMARY KEY ("elective_pool_id")
);

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectivePool" ADD CONSTRAINT "ElectivePool_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "StudyPlan"("study_plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectivePool" ADD CONSTRAINT "ElectivePool_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "StudyPlan"("study_plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;
