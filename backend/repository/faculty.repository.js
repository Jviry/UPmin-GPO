export function createFacultyRepository(prisma) {
  return {
    async findAll(position, { page = 1, limit = 10 } = {}) {
      const where = position ? { position } : {};
      const skip = (page - 1) * limit;

      const [faculties, total] = await Promise.all([
        prisma.faculty.findMany({
          where,
          include: { credentials: true },
          skip,
          take: limit,
          orderBy: { faculty_id: 'asc' },
        }),
        prisma.faculty.count({ where }),
      ]);

      return { faculties, total, page, limit };
    },

    async findByID(id) {
      return prisma.faculty.findUnique({
        where: { faculty_id: Number(id) }
      });
    },

    async create({ name, email, photo = null, position, credentials }) {
      return prisma.faculty.create({
        data: {
          name,
          email,
          photo,
          position,
          credentials: {
            create: credentials.map((degree) => ({ degree }))
          }
        }
      });
    },

    async delete(id) {
      return prisma.faculty.delete({
        where: { faculty_id: Number(id) }
      });
    },

    async update({ id, name, email, photo, position, credentials }) {
      return prisma.$transaction(async (tx) => {
        const faculty = await tx.faculty.update({
          where: { faculty_id: Number(id) },
          data: { name, email, photo, position }
        });

        if (credentials) {
          await tx.facultyCredential.deleteMany({
            where: { faculty_id: Number(id) }
          });
          await tx.facultyCredential.createMany({
            data: credentials.map((degree) => ({
              degree,
              faculty_id: Number(id)
            }))
          });
        }

        return tx.faculty.findUnique({
          where: { faculty_id: Number(id) },
          include: { credentials: true }
        });
      });
    },

    async syncProgramFaculty({ program_id, faculty_ids }) {
      return prisma.$transaction(async (tx) => {
        await tx.programFaculty.deleteMany({
          where: { program_id: Number(program_id) }
        });

        await tx.programFaculty.createMany({
          data: faculty_ids.map((faculty_id) => ({
            program_id: Number(program_id),
            faculty_id: Number(faculty_id)
          }))
        });

        return tx.programFaculty.findMany({
          where: { program_id: Number(program_id) },
          include: { faculty: { include: { credentials: true } } }
        })
      });
    }
  }
}
