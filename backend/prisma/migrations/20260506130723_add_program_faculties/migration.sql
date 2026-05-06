-- CreateTable
CREATE TABLE "ProgramFaculty" (
    "program_faculty_id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "faculty_id" INTEGER NOT NULL,

    CONSTRAINT "ProgramFaculty_pkey" PRIMARY KEY ("program_faculty_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramFaculty_program_id_faculty_id_key" ON "ProgramFaculty"("program_id", "faculty_id");

-- AddForeignKey
ALTER TABLE "ProgramFaculty" ADD CONSTRAINT "ProgramFaculty_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramFaculty" ADD CONSTRAINT "ProgramFaculty_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("faculty_id") ON DELETE CASCADE ON UPDATE CASCADE;
