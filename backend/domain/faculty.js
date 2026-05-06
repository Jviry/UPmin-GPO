import { DomainError } from './errors.js';

export function validateFacultyPosition(position) {
  const allowed = ['Program Coordinator']
  if (!allowed.includes(position)) {
    throw new DomainError(`Invalid position: ${position}`);
  }
}

export function validateCreateFaculty({ name, position, email, credentials }) {
  if (!name || name.trim() === '') {
    throw new DomainError('Faculty name is required');
  }
  if (!position || position.trim() === '') {
    throw new DomainError('Faculty Position is required');
  }
  if (!email || email.trim() === '') {
    throw new DomainError('Faculty Email is required');
  }
  if (!Array.isArray(credentials) || credentials.length === 0) {
    throw new DomainError('Faculty must have at least one credential');
  }
  if (credentials.some(c => !c || c.trim() === '')) {
    throw new DomainError('Credential degree cannot be empty');
  }
}
