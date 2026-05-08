import { validateProgramId } from '../../domain/program.js';
import { DomainError } from '../../domain/errors.js';

export function updateProgramUsecase({ programRepo, deleteFile }) {
  return async function(id, data, file) {
    validateProgramId(id);

    const existing = await programRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Program with ID ${id} not found`);
    }
    if (file && existing.photo) {
      deleteFile(existing.photo);
    }

    const photo = file ? `/uploads/${file.filename}` : existing.photo;
    const { type, name, description, history } = data;

    return await programRepo.update({ id, type, name, description, history, photo });
  };
}
