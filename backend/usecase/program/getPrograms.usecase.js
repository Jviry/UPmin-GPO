
export function createGetProgramUsecase(programRepo) {
  return async function() {
    return await programRepo.getAll();
  };
}
