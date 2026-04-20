export function createProgramRepository(prisma) {
  return {
    async getAllNames() {
      return await prisma.graduateProgram.findMany({
        select: { name: true, program_id: true }
      });
    }
  }
}
