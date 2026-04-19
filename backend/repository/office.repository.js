export function createOfficeRepository(prisma) {
  return {
    async findByID(id) {
      return prisma.office.findUnique({
        where: { office_id: id },
        include: {
          featuredPhotos: true
        },
      });
    },

    async updateAttribute(id, attribute) {
      return prisma.office.update({
        where: { office_id: id },
        data: attribute
      });
    }
  }
}
