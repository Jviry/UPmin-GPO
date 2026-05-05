import { validateScholarshipId } from '../../domain/scholarship.js';
import { DomainError } from '../../domain/errors.js';

export function getScholarshipByIdUsecase({ scholarshipRepo }) {
  return async function(id) {
    validateScholarshipId(id);

    const scholarship = await scholarshipRepo.findScholarshipById(id);
    
    if (!scholarship) {
      throw new DomainError(`Scholarship with ID ${id} not found`);
    }

    return { scholarship };
  };
}