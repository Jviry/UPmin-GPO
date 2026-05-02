export function createProgramRepository(prisma) {
  return {
    async getAllNames() {
      return await prisma.Program.findMany({
        select: { name: true, program_id: true }
      });
    }
  }
}
