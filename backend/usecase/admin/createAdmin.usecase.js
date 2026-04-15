import { validateNewAdmin } from '../../domain/admin.js';
import { DomainError } from '../../domain/errors.js';

export function createAdminUsecase({ adminRepo, hashPassword }) {
  return async function({ email, password, name }) {
    validateNewAdmin(email, password, name);

    const existing = await adminRepo.findByEmail(email);
    if (existing) throw new DomainError('Email match found: Admin already exists');

    const hashedPassword = await hashPassword(password);

    const newAdmin = await adminRepo.create({ email, name, password: hashedPassword });

    return { newAdmin };
  }
}
