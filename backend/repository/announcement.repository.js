export function createAnnouncementRepository(prisma) {
  return {
    async create({ title, content_description, admin_id }) {
      return prisma.announcement.create({
        data: {
          title,
          content_description,
          admin_id: parseInt(admin_id),
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

    async findAnnouncements() {
      return prisma.announcement.findMany({
        select: {
          announcement_id: true,
          title: true,
          content_description: true,
          date_posted: true
        }
      });
    }
  };
}
