export function createCoursePoolRepository(prisma) {
  return {
    async create({ name, program_id }) {
      return prisma.coursePool.create({
        data: {
          name,
          program_id
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

    async findCoursePools() {
      return prisma.coursePool.findMany({
        include: { entries: { include: { course: true } } }
      });
    },

    async findByProgramID(program_id) {
      return prisma.coursePool.findMany({
        where: { program_id: Number(program_id) },
        include: { entries: { include: { course: true } } }
      })
    }
  }
}
