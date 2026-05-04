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

    async createProgram(type, name, description, history, department_id) {
      return prisma.program.create({
        data: {
          type: type,
          name: name,
          description: description,
          history: history,
          department_id: parseInt(department_id),
          application_details: {
            create: {
              qualifications: "",
              application_instructions: "",
              application_url: "",
              recommendation_url: ""
            }
          }
        },
        include: {
          department: {
            select: { department_id: true, name: true }
          }
        }
      });
    },

    // Delete associated ProgramApplication before deleting Program 
    async deleteProgram(id) {
      const program = await prisma.program.findUnique({
        where: { program_id: parseInt(id) },
        select: { application_details_id: true }
      });
      
      if (program?.application_details_id) {
        await prisma.programApplication.delete({
          where: { application_details_id: program.application_details_id }
        });
      }

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
          history: data.history
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

    // Update ProgramApplication details, kept here since its still closely tied to Program entity
    async updateProgramApplication(id, data) {
      const program = await prisma.program.findUnique({
        where: { program_id: parseInt(id) },
        select: { application_details_id: true }
      });

      if (!program?.application_details_id) {
        throw new Error('Program application details not found');
      }

      return prisma.programApplication.update({
        where: { application_details_id: program.application_details_id },
        data: {
          qualifications: data.qualifications,
          application_instructions: data.application_instructions,
          application_url: data.application_url,
          recommendation_url: data.recommendation_url
        }
      });
    }
  };
}
