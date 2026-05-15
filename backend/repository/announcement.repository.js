export function createAnnouncementRepository(prisma) {
  return {
    async create({ title, content_description, admin_id, image_url}) {
      return prisma.announcement.create({
        data: {
          title,
          content_description,
          admin_id: parseInt(admin_id),
          image_url,
        },
      });
    },

    async update(id, attribute) {
      return prisma.announcement.update({
        where: {
          announcement_id: parseInt(id),
        },
        data: attribute,
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
          date_posted: true,
          image_url: true,
          attached_link: true,
          admin_id: true,
        },
        orderBy: { date_posted: 'desc'},
      });
    }
  };
}
