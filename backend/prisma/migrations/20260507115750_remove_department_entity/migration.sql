/*
  Warnings:

  - You are about to drop the column `department_id` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_department_id_fkey";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "department_id";

-- DropTable
DROP TABLE "Department";
