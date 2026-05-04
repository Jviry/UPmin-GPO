import { validateCoursePoolName } from '../../domain/course-pool.js';
import { DomainError } from '../../domain/errors.js';

export function createCoursePoolUsecase({ coursePoolRepo, programRepo }) {
  return async function({ name, program_id }) {
    validateCoursePoolName(name);

    const program = await programRepo.findProgramByID(program_id);
    if (!program) {
      throw new DomainError('Program not found');
    }

    return coursePoolRepo.create({ name, program_id });
  }
}
