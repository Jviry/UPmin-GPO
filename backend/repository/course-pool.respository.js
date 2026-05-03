export function createCoursePoolRepository(prisma) {
  return {
    async create({ name, program_id }) {
      return prisma.coursePool.create({
        data: {
          name,
          program_id
        }
      });
    }
  }
}
