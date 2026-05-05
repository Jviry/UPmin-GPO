export function deleteCoursePoolUsecase(coursePoolRepo) {
  return async function(course_pool_id) {
    const existing = await coursePoolRepo.findByID(course_pool_id);
    if (!existing) {
      throw new DomainError(`Course Pool with ID ${course_pool_id} not found`);
    }
    return await coursePoolRepo.delete(course_pool_id);
  }
}
