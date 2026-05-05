/*
  Warnings:

  - You are about to drop the column `application_instructions` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `application_url` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `qualifications` on the `Program` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Program" DROP COLUMN "application_instructions",
DROP COLUMN "application_url",
DROP COLUMN "qualifications";

-- CreateTable
CREATE TABLE "ProgramApplication" (
    "program_application_id" SERIAL NOT NULL,
    "qualifications" TEXT NOT NULL DEFAULT '',
    "application_instructions" TEXT NOT NULL DEFAULT '',
    "application_url" TEXT NOT NULL DEFAULT '',
    "recommendation_url" TEXT NOT NULL DEFAULT '',
    "program_id" INTEGER NOT NULL,

    CONSTRAINT "ProgramApplication_pkey" PRIMARY KEY ("program_application_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramApplication_program_id_key" ON "ProgramApplication"("program_id");

-- AddForeignKey
ALTER TABLE "ProgramApplication" ADD CONSTRAINT "ProgramApplication_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;
