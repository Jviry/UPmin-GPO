export function createProgramRepository(prisma) {
  return {
    // Untouched from previous version
    async getAllPrograms() {
      return await prisma.program.findMany({
        select: { name: true, program_id: true }
      });
    },

    async findProgramByID(id) {
      return prisma.program.findUnique({
        where: {
          program_id: parseInt(id),
        },
        include: {
          department: {
            select: {
              department_id: true,
              name: true
            }
          }
        }
      });
    },

    async createProgram(type, name, description, history, qualifications, application_instructions, application_url, department_id) {
      return prisma.program.create({
        data: {
          type: type,
          name: name,
          description: description,
          history: history,
          qualifications: qualifications,
          application_instructions: application_instructions,
          application_url: application_url,
          department_id: parseInt(department_id)
        },
        include: {
          department: {
            select: { department_id: true, name: true}
          }
        }
      });
    },

    async deleteProgram(id) {
      return prisma.program.delete({
        where: { program_id: parseInt(id) },
      });
    },

    async updateProgram(id, data) {
      return prisma.program.update({
        where: {
          program_id: parseInt(id),
        },
        data: {
          type: data.type,
          name: data.name,
          description: data.description,
          history: data.history,
          qualifications: data.qualifications,
          application_instructions: data.application_instructions,
          application_url: data.application_url
        },
        include: {
          department: {
            select: {
              department_id: true,
              name: true
            }
          }
        }
  });
}
  };
}
