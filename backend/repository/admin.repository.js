export function createAdminRepository(prisma) {
  return {
    async findByEmail(email) {
      return prisma.admin.findUnique({
        where: { email },
      });
    },

    async findByID(id) {
      return prisma.admin.findUnique({
        where: { admin_id: Number(id) },
      });
    },

    async create({ email, name, password }) {
      return prisma.admin.create({
        data: {
          email,
          name,
          password,
          role: 'admin',
        },
        select: {
          admin_id: true,
          email: true,
          name: true,
          role: true,
        }
      });
    },

    async updatePassword(id, hashedPassword) {
      return prisma.admin.update({
        where: { admin_id: Number(id) },
        data: { password: hashedPassword },
        select: {
          admin_id: true,
          email: true,
          name: true,
          role: true,
        }
      });
    },

    async delete(id) {
      return prisma.admin.delete({
        where: {
          admin_id: Number(id),
        },
        select: {
          admin_id: true,
          email: true,
          name: true,
          role: true,
        }
      })
    },
    async findAll() {
      return prisma.admin.findMany({
        select: {
          admin_id: true,
          name: true,
          email: true,
          role: true
        }
      });
    }
  }
}
