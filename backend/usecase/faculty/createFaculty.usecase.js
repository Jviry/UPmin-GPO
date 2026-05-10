import { validateCreateFaculty } from '../../domain/faculty.js';

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

export function createFacultyUsecase(facultyRepo) {
  return async function({ name, email, position, credentials, file }) {
    const parsedCredentials = parseCredentials(credentials);
    validateCreateFaculty({ name, position, email, credentials: parsedCredentials });

    const photo = file ? `/uploads/${file.filename}` : null;

    return await facultyRepo.create({
      name,
      email,
      photo: photo && photo.trim() !== '' ? photo : null,
      position,
      credentials: parsedCredentials
    });
  }
}
