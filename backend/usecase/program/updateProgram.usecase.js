import { validateProgramId, validateUpdateProgram } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function updateProgramUsecase({ programRepo }) {
  return async function(id, data) {
    validateProgramId(id);
    validateUpdateProgram(data);

    const existing = await programRepo.findProgramByID(id);
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }

    const updatedProgram = await programRepo.updateProgram(id, data);

    return { program: updatedProgram };
  };
}