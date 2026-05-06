import { DomainError } from './errors.js';

export function validateCoursePoolName(name) {
  if (!name || name.trim() === '') {
    throw new DomainError('Course Pool Name is required');
  }
}
export function validateCoursePoolID(id) {
  if (!id) {
    throw new DomainError('Course Pool ID is required');
  }
  if (isNaN(parseInt(id))) {
    throw new DomainError('Invalid Course Pool ID');
  }
}
