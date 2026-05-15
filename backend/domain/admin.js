import { DomainError } from './errors.js';

export const AdminRole = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin'
};

export function validateNewAdmin({ email, name, password }) {
  if (!email || !name || !password) throw new DomainError('All fields are required');
  if (password.length < 8) throw new DomainError('Password must be at least 8 characters');
}

export function validateNewPassword(newPassword) {
  if (!newPassword) throw new DomainError('New password required');
  if (newPassword.length < 8) throw new DomainError('Password must be at least 8 characters');
}

export function validateAdminID(id) {
  if (!id) throw new DomainError('Null admin ID');
}
