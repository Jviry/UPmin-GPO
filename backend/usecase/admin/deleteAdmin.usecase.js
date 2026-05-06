import { validateAdminID } from '../../domain/admin.js';

export function createDeleteAdminUsecase(adminRepo) {
  return async function(id) {
    validateAdminID(id);

    return await adminRepo.delete(id);
  }
}
