export const AdminRole = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin'
};

export function validateNewAdmin({ email, name, password }) {
  if (!email || !name || !password) throw new Error('All fields are required');
}

export function validateLoginInput({ email, password }) {
  if (!email || !password) throw new Error('Invalid email or password');
}

export function validateNewPassword(newPassword) {
  if (!newPassword) throw new Error('New password required');
}

