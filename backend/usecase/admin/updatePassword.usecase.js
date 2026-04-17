import { validateNewPassword } from '../../domain/admin.js';
import { validateAdminID } from '../../domain/admin.js';
import { DomainError } from '../../domain/errors.js';

export function createUpdatePasswordUsecase({ adminRepo, hashPassword, comparePassword }) {
  return async function(id, newPassword) {
    validateNewPassword(newPassword);
    validateAdminID(id);

    const isFound = await adminRepo.findByID(id);
    if (!isFound) throw new DomainError('Admin ID not found');

    const oldPassword = isFound.password;

    const isSame = await comparePassword(newPassword, oldPassword);
    if (isSame) throw new DomainError('Old pass and new pass must not be le same no?');

    const hashedNewPassword = await hashPassword(newPassword);

    const updatedAdmin = await adminRepo.updatePassword(id, hashedNewPassword);

    return { updatedAdmin };
  }
}
