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
        select: { code: true, course_id: true }
      });
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
