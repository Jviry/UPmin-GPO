export function createCourseUsecase(courseRepo) {
  return async function(courseData) {
    const { name, code, units, type } = courseData;
    validateCreateCourse({ name, code, units, type });
    return await courseRepo.create({ name, code, units, type });
  };
}
