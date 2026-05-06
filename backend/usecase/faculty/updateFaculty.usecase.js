import { DomainError } from '../../domain/errors.js';

export function updateFacultyUsecase(facultyRepo) {
  return async function({ id, name, photo, position, email, credentials }) {
    const existing = await facultyRepo.findByID(id)
    if (!existing) {
      throw new DomainError(`Faculty ${id} doesn't exist`);
    }
    return facultyRepo.update({
      id,
      name,
      photo: photo && photo.trim() !== '' ? photo : null,
      position,
      email,
      credentials
    });
  }
}
