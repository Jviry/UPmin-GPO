import { validateProgramId } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function updateProgramUsecase({ programRepo }) {
  return async function(id, data) {
    validateProgramId(id);

    const existing = await programRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }

    const updateData = Object.fromEntries(
      Object.entries({
        type: data.type,
        name: data.name,
        description: data.description,
        history: data.history,
        department_id: data.department_id
          ? parseInt(data.department_id)
          : undefined,
      }).filter(([_, value]) => value !== undefined)
    );
    return await programRepo.update(id, updateData);
  };
}
