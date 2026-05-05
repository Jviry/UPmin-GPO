export function createProgramRepository(prisma) {
  return {
    async getAllPrograms() {
      return await prisma.program.findMany({
        select: { name: true, program_id: true }
      });
    },

    async findByID(id) {
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

    async create({ type, name, description, history, department_id }) {
      return prisma.program.create({
        data: {
          type,
          name,
          description,
          history,
          department_id: parseInt(department_id),

          program_application: {
            create: {
              qualifications: "",
              application_instructions: "",
              application_url: "",
              recommendation_url: "",
            }
          }
        },
        include: {
          department: {
            select: { department_id: true, name: true }
          },
          program_application: true
        }
      });
    },

    async delete(id) {
      return prisma.program.delete({
        where: { program_id: parseInt(id) },
      });
    },

    async update(id, data) {
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
      return prisma.programApplication.update({
        where: {
          program_id: parseInt(id)
        },
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
