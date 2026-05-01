export function createCoreCourseUsecase(courseRepo) {
  return async function(courseData) {
    const { name, code, units, program_id } = courseData;
    const coreCourse = await courseRepo.create({ name, code, units, program_id, type: "core" });
    return { coreCourse };
  };
}
