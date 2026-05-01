export function getFacultyByPositionUsecase(facultyRepo) {
  return async function(position) {

    const faculty = await facultyRepo.findByPosition(position);

    return { faculty };
  };
}
