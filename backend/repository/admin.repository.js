export function createAdminRepository(prisma) {
  return {
    async findByEmail(email) {
      return prisma.admin.findUnique({
        where: { email },
      });
    },

    async findByID(id) {
      return prisma.admin.findUnique({
        where: { admin_id: id },
      });
    },

    async create({ email, name, password }) {
      return prisma.admin.create({
        data: {
          email,
          name,
          password,
          role: 'admin',
        }
      });
    },

    async updatePassword(id, hashedPassword) {
      return prisma.admin.update({
        where: { admin_id: Number(id) },
        data: { password: hashedPassword },
      });
    },

    async delete(id) {
      return prisma.admin.delete({
        where: {
          admin_id: Number(id),
        },
      })
    },
  }
}
