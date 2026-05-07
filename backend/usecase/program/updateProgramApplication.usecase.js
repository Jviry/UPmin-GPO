// updateProgramApplication.usecase.js
import { validateProgramId, validateUpdateProgramApplication } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function updateProgramApplicationUsecase({ programRepo }) {
  return async function(id, data) {
    validateProgramId(id);
    validateUpdateProgramApplication(data);

    const existing = await programRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }

    const updateData = Object.fromEntries(
      Object.entries({
        qualifications: data.qualifications,
        application_instructions: data.application_instructions,
        application_requirements: data.application_requirements,
        application_url: data.application_url,
        recommendation_url: data.recommendation_url,
      }).filter(([_, value]) => value !== undefined)
    );

    return await programRepo.updateProgramApplication(id, updateData);
  };
}
