export function getAllCoursesUsecase(courseRepo) {
  return async function({ page = 1, limit = 10, search = '' }) {
    return await courseRepo.findAll({ 
      page: Number(page), 
      limit: Number(limit), 
      search 
    });
  };
}
