import { validateProgramId } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function deleteProgramUsecase({ programRepo, deleteFile }) {
  return async function(id) {
    validateProgramId(id);

    const existing = await programRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }

    if (existing.photo) {
      deleteFile(existing.photo);
    }

    return await programRepo.delete(id);
  };
}
