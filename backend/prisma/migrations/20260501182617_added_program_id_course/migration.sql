-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "program_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE SET NULL ON UPDATE CASCADE;
