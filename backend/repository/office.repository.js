export function createOfficeRepository(prisma) {
  return {
    async findByID(id) {
      return prisma.office.findUnique({
        where: { office_id: Number(id) },
        include: {
          featuredPhotos: true
        },
      });
    },

    async patchOrgChartUrl(id, org_chart_url) {
      return prisma.office.update({
        where: { office_id: id },
        data: { org_chart_url }
      });
    }
  }
}
