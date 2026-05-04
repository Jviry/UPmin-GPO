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

    async syncEntries({ course_pool_id, course_ids }) {
      return prisma.$transaction(async (tx) => {
        await tx.coursePoolEntry.deleteMany({
          where: { course_pool_id: Number(course_pool_id) }
        });

        await tx.coursePoolEntry.createMany({
          data: course_ids.map(course_id => ({
            course_pool_id: Number(course_pool_id),
            course_id: Number(course_id)
          }))
        });

        return tx.coursePoolEntry.findMany({
          where: { course_pool_id: Number(course_pool_id) },
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
    }
  }
}
