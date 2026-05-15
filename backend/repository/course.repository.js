export function createCourseRepository(prisma) {
  return {
    async create(courseData) {
      return prisma.course.create({
        data: courseData
      });
    },

    async findByType(type) {
      return prisma.course.findMany({
        where: { type },
        select: { code: true, course_id: true, name: true, units: true, type: true }
      });
    },

    async findAll({ page, limit, search }) {
      const skip = (page - 1) * limit;
      const where = search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } }
        ]
      } : {};

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          skip,
          take: limit,
          orderBy: { code: 'asc' }
        }),
        prisma.course.count({ where })
      ]);

      return {
        courses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    },

    async findByID(id) {
      return prisma.course.findUnique({
        where: { course_id: Number(id) }
      });
    },

    async delete(id) {
      return prisma.course.delete({
        where: { course_id: Number(id) }
      })
    }
  }
}
