import { DomainError } from './errors.js';

export function validateCoursePoolName(name) {
  if (!name || name.trim() === '') {
    throw new DomainError('Course Pool Name is required');
  }
}

