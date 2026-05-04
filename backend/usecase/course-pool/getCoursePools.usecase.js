export function getCoursePoolsUsecase(coursePoolRepo) {
  return async function() {
    return await coursePoolRepo.findCoursePools();
  }
}
