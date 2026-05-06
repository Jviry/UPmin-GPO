import { validateCreateFaculty } from '../../domain/faculty.js';

export function createFacultyUsecase(facultyRepo) {
  return async function({ name, email, photo, position, credentials }) {
    validateCreateFaculty({ name, position, email, credentials });

    return await facultyRepo.create({
      name,
      email,
      photo: photo && photo.trim() !== '' ? photo : null,
      position,
      credentials
    });
  }
}
