export function syncStudyPlanCoursesUsecase({ studyPlanRepo, courseRepo }) {
  return async function({ study_plan_id, entryCourses }) {
    if (!Array.isArray(entryCourses)) {
      throw new DomainError('Courses must be an array');
    }

    const existing = await studyPlanRepo.findByID(study_plan_id);
    if (!existing) {
      throw new DomainError(`Study Plan with ID ${study_plan_id} not found`);
    }

    if (entryCourses.some(c => !c.year || !c.semester)) {
      throw new DomainError('Each course must have year and semester');
    }
    if (entryCourses.some(c => !c.is_elective_slot && !c.course_id)) {
      throw new DomainError('Non-elective slot must have a course_id');
    }
    if (entryCourses.some(c => c.is_elective_slot && c.course_id)) {
      throw new DomainError('Elective slot must not have a course_id');
    }

    const coreCourses = entryCourses.filter(c => !c.is_elective_slot);
    const courses = await Promise.all(
      coreCourses.map(c => courseRepo.findByID(c.course_id))
    );
    const invalid = courses.filter(course => course.type !== 'core');
    if (invalid.length > 0) {
      throw new DomainError(`Courses must be of type core: ${invalid.map(c => c.code).join(', ')}`);
    }

    return await studyPlanRepo.syncEntries({ study_plan_id, courses: coreCourses });
  }
}
