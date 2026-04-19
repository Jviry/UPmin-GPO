export function createAnnouncementRepository(prisma) {
  return {
    async create({ title, content_description, admin_id }) {
      return prisma.announcement.create({
        data: {
          title,
          content_description,
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

    async update(id, { title, content_description }) {
      return prisma.announcement.update({
        where: {
          announcement_id: parseInt(id),
        },
        data: {
          title,
          content_description,
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

    async delete(id) {
      return prisma.announcement.delete({
        where: {
          announcement_id: parseInt(id),
        },
      });
    },

    async findByID(id) {
      return prisma.announcement.findUnique({
        where: {
          announcement_id: parseInt(id),
        },
      });
    },
  };
}