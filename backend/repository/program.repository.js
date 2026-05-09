export function createProgramRepository(prisma) {
  return {
    async getAllPrograms() {
      return await prisma.program.findMany({
        select: { name: true, program_id: true, program_application: true, type: true },
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

    async create({ type, name, description, history, photo = null }) {
      return prisma.program.create({
        data: {
          type,
          name,
          description,
          history,
          photo,

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
          program_application: true
        }
      });
    },

    async delete(id) {
      return prisma.program.delete({
        where: { program_id: parseInt(id) },
      });
    },

    async update({ id, type, name, description, history, photo = null }) {
      return prisma.program.update({
        where: {
          program_id: parseInt(id),
        },
        data: {
          type,
          name,
          description,
          history,
          photo
        },
      });
    },

    // Update ProgramApplication details, kept here since its still closely tied to Program entity
    async updateProgramApplication({ program_id, qualifications, application_instructions, application_requirements, application_url, recommendation_url, fees_url }) {
      return prisma.programApplication.update({
        where: {
          program_id: parseInt(program_id)
        },
        data: {
          qualifications,
          application_instructions,
          application_url,
          application_requirements,
          recommendation_url,
          fees_url
        }
      });
    }
  };
}
