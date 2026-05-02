import e from 'express';
import { DomainError } from './errors.js';

export function validateCourseType(type) {
  if (type !== 'core' || type !== 'pool') {
    throw new DomainError(`Invalid course type`);
  }
}

export function validateCourseID(id) {
  if (!id) {
    throw new DomainError('Course ID is required');
  }
  if (isNaN(parseInt(id))) {
    throw new DomainError('Invalid Course ID');
  }
}

export function validateCreateCourseData({ name, code, units, type }) {
  if (!type || type.trim() === '') {
    throw new DomainError('Course Type is required');
  }
  if (type !== 'core' && type !== 'pool') {
    throw new DomainError('Course Type must be either core or pool');
  }
  if (type === 'core') {
    if (!name || name.trim() === '') {
      throw new DomainError('Course Name is required');
    }
  }
  if (!code || code.trim() === '') {
    throw new DomainError('Course Code is required');
  }
  if (!units) {
    throw new DomainError('Units is required');
  }
  if (isNaN(parseInt(units))) {
    throw new DomainError('Invalid units');
  }
}
