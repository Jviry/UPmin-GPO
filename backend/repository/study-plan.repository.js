export function createStudyPlanRepository(prisma) {
  return {
    async create({ name, years, program_id }) {
      return prisma.studyPlan.create({
        data: {
          name,
          years,
          program_id: Number(program_id)
        }
      });
    },

    async syncEntries({ study_plan_id, courses }) {
      return prisma.$transaction(async (tx) => {
        await tx.programCourse.deleteMany({
          where: { study_plan_id: Number(study_plan_id) }
        });

        await tx.programCourse.createMany({
          data: courses.map(({ course_id, year, semester, is_elective_slot }) => ({
            study_plan_id: Number(study_plan_id),
            course_id: Number(course_id),
            year: Number(year),
            semester: Number(semester),
            is_elective_slot: Boolean(is_elective_slot)
          }))
        });

        return tx.programCourse.findMany({
          where: { study_plan_id: Number(study_plan_id) },
          include: { course: true }
        });
      });
    },

    async findStudyPlans() {
      return prisma.studyPlan.findMany({
        include: { program_courses: { include: { course: true } } }
      });
    },

    async findByProgramID(program_id) {
      return prisma.studyPlan.findMany({
        where: { program_id: Number(program_id) },
        include: { program_courses: { include: { course: true } } }
      })
    },

    async delete(study_plan_id) {
      return prisma.studyPlan.delete({
        where: { study_plan_id: Number(study_plan_id) }
      });
    },

    async findByID(study_plan_id) {
      return prisma.studyPlan.findUnique({
        where: { study_plan_id: Number(study_plan_id) }
      })
    }
  }
}
