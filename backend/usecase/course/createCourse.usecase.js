export function createCourseUsecase(courseRepo) {
  return async function(courseData) {
    const { name, code, units, type } = courseData;
    return await courseRepo.create({ name, code, units, type });
  };
}
