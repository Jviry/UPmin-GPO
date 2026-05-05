export function getStudyPlanByProgramIDUSecase({ studyPlanRepo, programRepo }) {
  return async function(program_id) {

    const program = await programRepo.findProgramByID(program_id);
    if (!program) {
      throw new DomainError('Program not found');
    }

    return await studyPlanRepo.findByProgramID(program_id);
  }
}
