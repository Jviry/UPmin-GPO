/*
  Warnings:

  - Added the required column `org_chart_url` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "org_chart_url" TEXT NOT NULL;
