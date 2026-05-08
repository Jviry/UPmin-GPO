import { validateCreateFaculty } from '../../domain/faculty.js';

export function createFacultyUsecase(facultyRepo) {
  return async function({ name, email, photo, position, credentials, file }) {
    validateCreateFaculty({ name, position, email, credentials });

    const photo = file ? `/uploads/${file.filename}` : null;

    return await facultyRepo.create({
      name,
      email,
      photo: photo && photo.trim() !== '' ? photo : null,
      position,
      credentials
    });
  }
}
