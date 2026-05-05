// updateProgramApplication.usecase.js
import { validateProgramId, validateUpdateProgramApplication } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function updateProgramApplicationUsecase({ programRepo }) {
  return async function(id, data) {
    validateProgramId(id);
    validateUpdateProgramApplication(data);

    const existing = await programRepo.findProgramByID(id);
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }

    const updatedApplication = await programRepo.updateProgramApplication(id, data);

    return { applicationDetails: updatedApplication };
  };
}