-- DropForeignKey
ALTER TABLE "ProgramApplication" DROP CONSTRAINT "ProgramApplication_program_id_fkey";

-- AddForeignKey
ALTER TABLE "ProgramApplication" ADD CONSTRAINT "ProgramApplication_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE CASCADE ON UPDATE CASCADE;
