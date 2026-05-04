import { validateCourseType } from '../../domain/course.js';

export function getCourseByTypeUsecase(courseRepo) {
  return async function(type) {
    const normalizedType = String(type).toLowerCase();
    validateCourseType(normalizedType);

    return await courseRepo.findByType(normalizedType);
  };
}
