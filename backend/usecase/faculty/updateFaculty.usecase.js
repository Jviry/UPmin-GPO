import { DomainError } from '../../domain/errors.js';

function parseCredentials(credentials) {
  if (typeof credentials === 'string') {
    try {
      return JSON.parse(credentials);
    } catch {
      return credentials;
    }
  }
  return credentials;
}

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
    const parsedCredentials = parseCredentials(credentials);

    return facultyRepo.update({
      id,
      name,
      photo: photo && photo.trim() !== '' ? photo : null,
      position,
      email,
      credentials: parsedCredentials
    });
  }
}
