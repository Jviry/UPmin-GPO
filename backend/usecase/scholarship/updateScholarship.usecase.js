import { validateScholarshipId, validateUpdateScholarship } from '../../domain/scholarship.js';
import { DomainError } from '../../domain/errors.js';

export function updateScholarshipUsecase({ scholarshipRepo, deleteFile }) {
  return async function({ id, name, description, covered_programs, application_instructions, application_url, recommendation_url, contact_info, file }) {
    validateScholarshipId(id);

    const existing = await scholarshipRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Scholarship with ID ${id} not found`);
    }

    validateUpdateScholarship({ name, description, covered_programs, application_instructions, application_url, contact_info });

    if (file && existing.image_url) {
      deleteFile(existing.image_url);
    }

    const image_url = file ? `/uploads/${file.filename}` : existing.image_url;

    const updatedScholarship = await scholarshipRepo.updateScholarship(id, {
      name,
      description,
      covered_programs,
      application_instructions,
      application_url,
      recommendation_url,
      contact_info,
      image_url: image_url && image_url.trim() !== '' ? image_url : null,
    });

    return { scholarship: updatedScholarship };
  };
}