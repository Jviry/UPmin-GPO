export function createCourseRepository(prisma) {
  return {
    async create(courseData) {
      return prisma.course.create({
        data: courseData
      });
    },
  }
}
