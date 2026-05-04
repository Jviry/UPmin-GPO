import { DomainError } from './errors.js';

export function validateFacultyPosition(position) {
  const allowed = ['Program Coordinator']
  if (!allowed.includes(position)) {
    throw new DomainError(`Invalid position: ${position}`);
  }
}
