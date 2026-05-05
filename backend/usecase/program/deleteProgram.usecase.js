import { validateProgramId } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function deleteProgramUsecase({ programRepo }) {
  return async function(id) {
    validateProgramId(id);

    const existing = await programRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }

    return await programRepo.delete(id);
  };
}
