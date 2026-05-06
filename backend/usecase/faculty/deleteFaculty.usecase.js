import { DomainError } from '../../domain/errors.js';

export function deleteFacultyUsecase(facultyRepo) {
  return async function(id) {
    const exists = await facultyRepo.findByID(id);

    if (!exists) {
      throw new DomainError('Faculty ID does not exist!');
    }
    return await facultyRepo.delete(id);
  }

}
