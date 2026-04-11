-- CreateTable
CREATE TABLE "Announcement" (
    "announcement_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content_description" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "date_posted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateTable
CREATE TABLE "Office" (
    "office_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("office_id")
);

-- CreateTable
CREATE TABLE "College" (
    "college_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dean" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("college_id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "faculty_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "college_id" INTEGER NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("faculty_id")
);

-- CreateTable
CREATE TABLE "GraduateProgram" (
    "program_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "years" INTEGER NOT NULL,
    "history" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "application_process" TEXT NOT NULL,
    "application_url" TEXT NOT NULL,
    "college_id" INTEGER NOT NULL,

    CONSTRAINT "GraduateProgram_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "Course" (
    "course_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "units" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "ProgramCourse" (
    "program_course_id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,

    CONSTRAINT "ProgramCourse_pkey" PRIMARY KEY ("program_course_id")
);

-- CreateTable
CREATE TABLE "DownloadableResource" (
    "resource_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "program_id" INTEGER NOT NULL,

    CONSTRAINT "DownloadableResource_pkey" PRIMARY KEY ("resource_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_email_key" ON "Office"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_email_key" ON "Faculty"("email");

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("college_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduateProgram" ADD CONSTRAINT "GraduateProgram_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("college_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "GraduateProgram"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadableResource" ADD CONSTRAINT "DownloadableResource_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "GraduateProgram"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;
