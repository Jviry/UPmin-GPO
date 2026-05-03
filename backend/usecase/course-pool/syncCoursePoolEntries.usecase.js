import { DomainError } from '../../domain/errors.js';
import { validateCoursePoolID } from '../../domain/course-pool.js';

export function syncCoursePoolEntriesUsecase({ coursePoolRepo, courseRepo }) {
  return async function({ course_pool_id, course_ids }) {
    validateCoursePoolID(course_pool_id);
    const courses = await Promise.all(
      course_ids.map(course_id => courseRepo.findById(course_id))
    );

    const invalid = courses.filter(course => course.type !== 'pool');
    if (invalid.length > 0) {
      throw new DomainError(`Courses must be of type pool: ${invalid.map(c => c.code).join(', ')}`);
    }


    return await coursePoolRepo.syncEntries({ course_pool_id, course_ids });
  }
}
