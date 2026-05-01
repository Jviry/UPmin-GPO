
export function createGetProgramNamesUsecase(programRepo) {
  return async function() {
    return await programRepo.getAllNames();
  };
}
