/*
  Warnings:

  - You are about to drop the column `course_pool_name` on the `CoursePool` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CoursePool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoursePool" DROP COLUMN "course_pool_name",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");
