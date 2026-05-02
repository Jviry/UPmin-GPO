import { DomainError } from './errors.js';

export function validateCreateProgram(data) {
  if (!data.type || !data.name || !data.description || !data.history || !data.qualifications || !data.application_instructions || !data.application_url || !data.department_id) throw new DomainError('All fields are required');
}

export function validateProgramId(id) {
  if (!id) throw new DomainError('Program ID is required');
  if (isNaN(parseInt(id))) throw new DomainError('Invalid program ID');
}

export function validateUpdateProgram(data) {
  if (!data.type || !data.name || !data.description || !data.history || !data.qualifications || !data.application_instructions || !data.application_url) throw new DomainError('All fields are required');
}