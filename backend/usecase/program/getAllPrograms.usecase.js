export function getAllProgramsUsecase({ programRepo }) {
  return async function() {
    const programs = await programRepo.getAllPrograms();
    return { programs };
  };
}