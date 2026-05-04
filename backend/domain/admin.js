import { DomainError } from './errors.js';

export const AdminRole = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin'
};

export function validateNewAdmin({ email, name, password }) {
  if (!email || !name || !password) throw new DomainError('All fields are required');
}

export function validateNewPassword(newPassword) {
  if (!newPassword) throw new DomainError('New password required');
}

export function validateAdminID(id) {
  if (!id) throw new DomainError('Null admin ID');
}
