export function createTestimonyRepository(prisma) {
  return {
    async findAll() {
      return prisma.testimony.findMany({
        orderBy: {
            testimony_id: 'desc',
        },
      });
    },

    async findByID(id) {
      return prisma.testimony.findUnique({
        where: {
          testimony_id: parseInt(id),
        },
      });
    },
  };
}