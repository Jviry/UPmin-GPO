import { validateCreateScholarship } from '../../domain/scholarship.js';

export function createScholarshipUsecase({ scholarshipRepo }) {
  return async function(data) {
    validateCreateScholarship(data);

    const newScholarship = await scholarshipRepo.createScholarship(
        data.name,
        data.description,
        data.covered_programs,
        data.application_instructions,
        data.application_url,
        data.recommendation_url,
        data.contact_info,
        data.admin_id
    );

    return { scholarship: newScholarship };
  };
}