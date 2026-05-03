import { validateScholarshipId, validateUpdateScholarship } from '../../domain/scholarship.js';
import { DomainError } from '../../domain/errors.js';

export function updateScholarshipUsecase({ scholarshipRepo }) {
  return async function(id, data) {
    validateScholarshipId(id);
    validateUpdateScholarship(data);

    const existing = await scholarshipRepo.findScholarshipByID(id);
    if (!existing) {
      throw new DomainError(`Scholarship with ID ${id} not found`);
    }

    const updatedScholarship = await scholarshipRepo.updateScholarship(id, data);

    return { scholarship: updatedScholarship };
  };
}