export function createProgramRepository(prisma) {
  return {
    async getAll() {
      return prisma.program.findMany();
    }
  }
}
