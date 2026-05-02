import { validateCourseType } from '../../domain/course.js';

export function getCourseByTypeUsecase(courseRepo) {
  return async function(type) {
    validateCourseType(type);
    return await courseRepo.findByType(type);
  };
}
