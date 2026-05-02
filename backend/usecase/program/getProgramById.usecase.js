import { validateProgramId } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function getProgramByIdUsecase({ programRepo }) {
  return async function(id) {
    validateProgramId(id);

    const program = await programRepo.findProgramByID(id);
    
    if (!program) {
      throw new DomainError(`Program with ID ${id} not found`);
    }

    return { program };
  };
}