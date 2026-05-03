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

    async findCoursePools() {
      return prisma.coursePool.findMany();
    },

    async findCoursePoolByProgramID(program_id) {
      return prisma.coursePool.findMany({
        where: { program_id: Number(program_id) }
      })
    }
  }
}
