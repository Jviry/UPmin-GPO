import { DomainError } from '../../domain/errors.js';
import { AdminRole } from '../../domain/admin.js';

export function createUpdateAdminUsecase({ adminRepo, hashPassword }) {
  return async function(id, { name, email, role, newPassword }) {
    const existing = await adminRepo.findByID(id);
    if (!existing) throw new DomainError('Admin not found');

    if (role && !Object.values(AdminRole).includes(role)) {
      throw new DomainError('Invalid role');
    }

    if (existing.role === AdminRole.SUPERADMIN && role === AdminRole.ADMIN) {
      throw new DomainError('Cannot downgrade a superadmin to admin');
    }

    if (email && email !== existing.email) {
      const taken = await adminRepo.findByEmail(email);
      if (taken) throw new DomainError('Email is already in use');
    }

    let hashedPassword;
    if (newPassword) {
      hashedPassword = await hashPassword(newPassword);
    }

    return adminRepo.update(id, { name, email, role, hashedPassword });
  };
}
