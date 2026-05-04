import { DomainError } from '../../domain/errors.js';
import { validateCoursePoolID } from '../../domain/course-pool.js';

export function syncCoursePoolEntriesUsecase({ coursePoolRepo, courseRepo }) {
  return async function({ course_pool_id, course_ids }) {
    if (!Array.isArray(course_ids)) {
      throw new DomainError('course_ids must be an array');
    }

    const unique_course_ids = [...new Set(course_ids)];

    validateCoursePoolID(course_pool_id);

    const courses = await Promise.all(
      unique_course_ids.map(course_id => courseRepo.findByID(course_id))
    );

    const invalid = courses.filter(course => course.type !== 'pool');
    if (invalid.length > 0) {
      throw new DomainError(`Courses must be of type pool: ${invalid.map(c => c.code).join(', ')}`);
    }


    return await coursePoolRepo.syncEntries({ course_pool_id, course_ids: unique_course_ids });
  }
}
