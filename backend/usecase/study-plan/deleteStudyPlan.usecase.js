export function deleteStudyPlanUsecase(studyPlanRepo) {
  return async function(study_plan_id) {
    const existing = await studyPlanRepo.findByID(study_plan_id);
    if (!existing) {
      throw new DomainError(`Study Plan with ID ${study_plan_id} not found`);
    }
    return await studyPlanRepo.delete(study_plan_id);
  }
}
