export function getCoursePoolByProgramIDUsecase({ coursePoolRepo, programRepo }) {
  return async function(program_id) {

    const program = await programRepo.findProgramByID(program_id);
    if (!program) {
      throw new DomainError('Program not found');
    }

    return await coursePoolRepo.findCoursePoolByProgramID(program_id);
  }
}
