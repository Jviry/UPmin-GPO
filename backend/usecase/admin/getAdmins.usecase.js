export function createGetAdminsUsecase(adminRepo) {
  return async function() {
    return await adminRepo.findAll();
  }
}
