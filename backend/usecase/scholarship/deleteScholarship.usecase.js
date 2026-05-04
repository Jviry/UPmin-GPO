import { validateScholarshipId } from '../../domain/scholarship.js';
import { DomainError } from '../../domain/errors.js';

export function deleteScholarshipUsecase({ scholarshipRepo }) {
  return async function(id) {
    validateScholarshipId(id);

    const existing = await scholarshipRepo.findScholarshipByID(id);
    if (!existing) {
      throw new DomainError(`Scholarship with ID ${id} not found`);
    }

    const deletedScholarship = await scholarshipRepo.deleteScholarship(id);

    return { deletedScholarship };
  };
}