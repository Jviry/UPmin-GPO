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
      return prisma.$transaction([
        prisma.coursePoolEntry.deleteMany({
          where: { course_pool_id: Number(course_pool_id) }
        }),
        prisma.coursePoolEntry.createMany({
          data: course_ids.map(course_id => ({
            course_pool_id: Number(course_pool_id),
            course_id: Number(course_id)
          }))
        })
      ]);
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
