import { DomainError } from '../../domain/errors.js';

export function deleteFacultyUsecase({ facultyRepo, deleteFile }) {
  return async function(id) {
    const exists = await facultyRepo.findByID(id);

    if (!exists) {
      throw new DomainError('Faculty ID does not exist!');
    }
    if (exists.photo) {
      deleteFile(exists.photo);
    }
    return await facultyRepo.delete(id);
  }

}
