import { validateFacultyPosition } from '../../domain/faculty.js';

export function getFacultyUsecase(facultyRepo) {
  return async function(position, { page, limit } = {}) {
    if (position) {
      validateFacultyPosition(position);
    }
    return facultyRepo.findAll(position, { page, limit });
  };
}
