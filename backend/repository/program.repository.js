export function createProgramRepository(prisma) {
  return {
    async getAllPrograms() {
      return await prisma.program.findMany({
        select: { name: true, program_id: true, program_application: true },
      });
    },

    async findByID(id) {
      return prisma.program.findUnique({
        where: {
          program_id: parseInt(id),
        },
        include: {
          program_application: true,
          course_pools: { include: { entries: { include: { course: true } } } },
          study_plans: { include: { program_courses: { include: { course: true } } } },
          faculties: { include: { faculty: { include: { credentials: true } } } }
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
              application_requirements: "",
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

    async update({ id, type, name, description, history }) {
      return prisma.program.update({
        where: {
          program_id: parseInt(id),
        },
        data: {
          type,
          name,
          description,
          history
        },
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
          application_requirements: data.application_requirements,
          recommendation_url: data.recommendation_url
        }
      });
    }
  };
}
