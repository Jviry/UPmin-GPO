import { validateProgramId } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function updateProgramUsecase({ programRepo }) {
  return async function(id, data) {
    validateProgramId(id);

    const existing = await programRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }
    const { type, name, description, history } = data;
    return await programRepo.update({ id, type, name, description, history });
  };
}
