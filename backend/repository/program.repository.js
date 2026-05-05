export function createProgramRepository(prisma) {
  return {
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
          },
          program_application: true,
          course_pools: { include: { entries: { include: { course: true } } } },
          study_plans: { include: { program_courses: { include: { course: true } } } }
        }
      });
    },

    async createProgram(type, name, description, history, department_id) {
      const programApplication = await prisma.programApplication.create({
        data: {
          qualifications: "",
          application_instructions: "",
          application_url: "",
          recommendation_url: ""
        }
      });

      return prisma.program.create({
        data: {
          type: type,
          name: name,
          description: description,
          history: history,
          department_id: parseInt(department_id),
          program_application_id: programApplication.program_application_id
        },
        include: {
          department: {
            select: { department_id: true, name: true }
          },
          program_application: true
        }
      });
    },

    async deleteProgram(id) {
      const program = await prisma.program.findUnique({
        where: { program_id: parseInt(id) },
        select: { program_application_id: true }
      });

      if (program?.program_application_id) {
        await prisma.programApplication.delete({
          where: { program_application_id: program.program_application_id }
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
          history: data.history,
          department_id: data.department_id ? parseInt(data.department_id) : undefined
        },
        include: {
          department: {
            select: {
              department_id: true,
              name: true
            }
          },
          program_application: true
        }
      });
    },

    // Update ProgramApplication details, kept here since its still closely tied to Program entity
    async updateProgramApplication(id, data) {
      const program = await prisma.program.findUnique({
        where: { program_id: parseInt(id) },
        select: { program_application_id: true }
      });

      if (!program?.program_application_id) {
        throw new Error('Program application details not found');
      }

      return prisma.programApplication.update({
        where: { program_application_id: program.program_application_id },
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
