import { DomainError } from './errors.js';

export function validateCreateProgram(data) {
  if (!data.type || !data.name || !data.description || !data.history || !data.department_id) throw new DomainError('All fields are required');
}

export function validateProgramId(id) {
  if (!id) throw new DomainError('Program ID is required');
  if (isNaN(parseInt(id))) throw new DomainError('Invalid program ID');
}

export function validateUpdateProgram(data) {
  if (!data.type || !data.name || !data.description || !data.history || !data.department_id) throw new DomainError('All fields are required');
}

// Validate application details but allow partial updates as some fields are optional
export function validateUpdateProgramApplication(data) {
  if (data.qualifications !== undefined && typeof data.qualifications !== 'string' || data.application_instructions !== undefined && typeof data.application_instructions !== 'string' || data.application_url !== undefined && typeof data.application_url !== 'string') {
    throw new DomainError('Application details must be strings');
  }
  if (data.recommendation_url !== undefined && data.recommendation_url !== null && typeof data.recommendation_url !== 'string') {
    throw new DomainError('Recommendation URL must be a string or null');
  }
}