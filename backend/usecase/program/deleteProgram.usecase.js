import { validateProgramId } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function deleteProgramUsecase({ programRepo }) {
  return async function(id) {
    validateProgramId(id);

    const existing = await programRepo.findProgramByID(id); 
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }

    const deletedProgram = await programRepo.deleteProgram(id);

    return { deletedProgram };
  };
}