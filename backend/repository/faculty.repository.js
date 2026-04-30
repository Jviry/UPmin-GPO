export function createFacultyRepository(prisma) {
  return {
    async findByPosition(position) {
      return prisma.faculty.findMany({
        where: { position }
      });
    }
  }
}
