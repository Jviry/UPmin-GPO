export function createScholarshipRepository(prisma) {
  return {
    async getAllScholarships() {
      return prisma.scholarship.findMany({
        orderBy: {
          scholarship_id: 'desc',
        },
        include: {
          admin: {
            select: {
              admin_id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    },

    async findScholarshipByID(id) {
      return prisma.scholarship.findUnique({
        where: {
          scholarship_id: parseInt(id),
        },
        include: {
          admin: {
            select: {
              admin_id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    },

    async createScholarship(name, description, covered_programs, application_instructions, application_url, recommendation_url, contact_info, admin_id) {
      return prisma.scholarship.create({
        data: {
          name: name,
          description: description,
          covered_programs: covered_programs,
          application_instructions: application_instructions,
          application_url: application_url,
          recommendation_url: recommendation_url || null,
          contact_info: contact_info,
          admin_id: parseInt(admin_id),
        },
        include: {
          admin: {
            select: {
              admin_id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    },

    async updateScholarship(id, data) {
      return prisma.scholarship.update({
        where: {
          scholarship_id: parseInt(id),
        },
        data: {
          name: data.name,
          description: data.description,
          covered_programs: data.covered_programs,
          application_instructions: data.application_instructions,
          application_url: data.application_url,
          recommendation_url: data.recommendation_url || null,
          contact_info: data.contact_info,
        },
        include: {
          admin: {
            select: {
              admin_id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    },

    async deleteScholarship(id) {
      return prisma.scholarship.delete({
        where: {
          scholarship_id: parseInt(id),
        },
      });
    },
  };
}