export function createProgramRepository(prisma) {
  return {
    async getAll() {
      return await prisma.graduateProgram.findMany();
    }
  }
}
