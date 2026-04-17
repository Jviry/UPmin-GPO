import { validateAdminID } from '../../domain/admin.js';

export function createDeleteAdminUsecase(adminRepo) {
  return async function(id) {
    validateAdminID(id);

    const deletedAdmin = await adminRepo.delete(id);

    return { deletedAdmin };
  }
}
