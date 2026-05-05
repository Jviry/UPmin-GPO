import { DomainError } from './errors.js';

export function validateLoginInput({ email, password }) {
  if (!email || !password) throw new DomainError('Invalid email or password');
}
