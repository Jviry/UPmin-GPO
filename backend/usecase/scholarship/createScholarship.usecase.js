import { validateCreateScholarship } from '../../domain/scholarship.js';

export function createScholarshipUsecase({ scholarshipRepo }) {
  return async function({ name, description, covered_programs, application_instructions, application_url, recommendation_url, contact_info, admin_id, file }) {
    validateCreateScholarship({ name, description, covered_programs, application_instructions, application_url, contact_info, admin_id });

    const image_url = file ? `/uploads/${file.filename}` : null;

    const newScholarship = await scholarshipRepo.createScholarship({
      name,
      description,
      covered_programs,
      application_instructions,
      application_url,
      recommendation_url,
      contact_info,
      admin_id,
      image_url: image_url && image_url.trim() !== '' ? image_url : null,
    });

    return { scholarship: newScholarship };
  };
}