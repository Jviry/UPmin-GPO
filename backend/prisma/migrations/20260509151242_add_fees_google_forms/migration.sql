/*
  Warnings:

  - Added the required column `application_google_url` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "application_google_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProgramApplication" ADD COLUMN     "fees_url" TEXT NOT NULL DEFAULT '';
