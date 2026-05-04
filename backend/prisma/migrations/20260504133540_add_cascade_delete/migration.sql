-- DropForeignKey
ALTER TABLE "CoursePoolEntry" DROP CONSTRAINT "CoursePoolEntry_course_id_fkey";

-- DropForeignKey
ALTER TABLE "CoursePoolEntry" DROP CONSTRAINT "CoursePoolEntry_course_pool_id_fkey";

-- DropForeignKey
ALTER TABLE "ProgramCourse" DROP CONSTRAINT "ProgramCourse_course_id_fkey";

-- DropForeignKey
ALTER TABLE "ProgramCourse" DROP CONSTRAINT "ProgramCourse_study_plan_id_fkey";

-- AddForeignKey
ALTER TABLE "CoursePoolEntry" ADD CONSTRAINT "CoursePoolEntry_course_pool_id_fkey" FOREIGN KEY ("course_pool_id") REFERENCES "CoursePool"("course_pool_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePoolEntry" ADD CONSTRAINT "CoursePoolEntry_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "StudyPlan"("study_plan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;
