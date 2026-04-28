import { validateLoginInput } from "../../domain/admin.js";
import { DomainError } from "../../domain/errors.js";

export function createLoginUsecase({ adminRepo, comparePassword, signToken }) {
  return async function({ email, password }) {
    validateLoginInput({ email, password });

    const admin = await adminRepo.findByEmail(email);
    if (!admin) throw new DomainError('Invalid Email');

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) throw new DomainError('Invalid Password');

    const token = signToken({ admin_id: admin.admin_id, role: admin.role });

    return { token };
  }
}

