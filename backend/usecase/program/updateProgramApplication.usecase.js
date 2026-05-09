// updateProgramApplication.usecase.js
import { validateProgramId, validateUpdateProgramApplication } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function updateProgramApplicationUsecase({ programRepo, deleteFile }) {
  return async function({ program_id, qualifications, application_instructions, application_requirements, application_url, recommendation_url, fees_url }) {
    validateProgramId(program_id);
    validateUpdateProgramApplication({ qualifications, application_instructions, application_requirements, application_url, recommendation_url, fees_url });

    const existing = await programRepo.findByID(program_id);
    if (!existing) {
      throw new DomainError(`Program with ID ${program_id} not found`);
    }

    const existingApplication = existing.program_application;

    if (application_url && existingApplication.application_url) deleteFile(existingApplication.application_url);
    if (recommendation_url && existingApplication.recommendation_url) deleteFile(existingApplication.recommendation_url);
    if (fees_url && existingApplication.fees_url) deleteFile(existingApplication.fees_url);

    return await programRepo.updateProgramApplication({ program_id, qualifications, application_instructions, application_requirements, application_url, recommendation_url, fees_url });
  };
}
