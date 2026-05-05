import { validateCourseID } from '../../domain/course.js';

export function deleteCourseUsecase(courseRepo) {
  return async function(id) {
    validateCourseID(id);
    return await courseRepo.delete(id);
  };
}
