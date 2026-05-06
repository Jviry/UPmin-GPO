import { DomainError } from '../../domain/errors.js';

export function createStudyPlanUsecase({ studyPlanRepo, programRepo }) {
  return async function({ name, years, program_id }) {
    if (!years) {
      throw new DomainError('Years is required');
    }
    if (isNaN(parseInt(years))) {
      throw new DomainError('Years must be a number');
    }
    const program = await programRepo.findProgramByID(program_id);
    if (!program) {
      throw new DomainError('Program not found');
    }
    return studyPlanRepo.create({ name: name || null, years, program_id });
  }
}
