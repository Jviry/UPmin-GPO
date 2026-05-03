import { validateCoursePoolName } from '../../domain/course-pool.js';

export function createCoursePoolUsecase(coursePoolRepo, programRepo) {
  return async function({ name, program_id }) {
    validateCoursePoolName(name);

    const program = await programRepo.findByID(program_id);
    if (!program) {
      throw new DomainError('Program not found');
    }

    return coursePoolRepo.create({ name, program_id });
  }
}
