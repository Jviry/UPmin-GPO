import { validateScholarshipId } from '../../domain/scholarship.js';
import { DomainError } from '../../domain/errors.js';

export function deleteScholarshipUsecase({ scholarshipRepo, deleteFile }) {
  return async function(id) {
    validateScholarshipId(id);

    const existing = await scholarshipRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Scholarship with ID ${id} not found`);
    }

    if (existing.image_url) {
      deleteFile(existing.image_url);
    }

    const deletedScholarship = await scholarshipRepo.deleteScholarship(id);

    return { deletedScholarship };
  };
}