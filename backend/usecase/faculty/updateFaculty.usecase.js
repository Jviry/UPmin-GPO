import { DomainError } from '../../domain/errors.js';

export function updateFacultyUsecase({ facultyRepo, deleteFile }) {
  return async function({ id, name, position, email, credentials, file }) {
    const existing = await facultyRepo.findByID(id)
    if (!existing) {
      throw new DomainError(`Faculty ${id} doesn't exist`);
    }

    if (file && existing.photo) {
      deleteFile(existing.photo);
    }

    const photo = file ? `/uploads/${file.filename}` : existing.photo;

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
