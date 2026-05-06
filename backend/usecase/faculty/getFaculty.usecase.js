import { validateFacultyPosition } from '../../domain/faculty.js';

export function getFacultyUsecase(facultyRepo) {
  return async function(position) {
    if (position) {
      validateFacultyPosition(position);
    }
    return facultyRepo.findAll(position);
  };
}
