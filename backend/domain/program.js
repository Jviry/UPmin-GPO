import { DomainError } from './errors.js';

export function validateCreateProgram({ type, name, description, history }) {
  if (!type || !name || !description || !history) throw new DomainError('All fields are required except photo');
}

export function validateProgramId(id) {
  if (!id) throw new DomainError('Program ID is required');
  if (isNaN(parseInt(id))) throw new DomainError('Invalid program ID');
}

// Validate application details but allow partial updates as some fields are optional
export function validateUpdateProgramApplication({ qualifications, application_instructions, application_requirements, application_url, recommendation_url, fees_url }) {
  if (qualifications !== undefined && typeof qualifications !== 'string') {
    throw new DomainError('Qualifications must be a string');
  }
  if (application_instructions !== undefined && typeof application_instructions !== 'string') {
    throw new DomainError('Application instructions must be a string');
  }
  if (application_requirements !== undefined && typeof application_requirements !== 'string') {
    throw new DomainError('Application requirements must be a string');
  }
  if (application_url !== undefined && typeof application_url !== 'string') {
    throw new DomainError('Application URL must be a string');
  }
  if (recommendation_url !== undefined && recommendation_url !== null && typeof data.recommendation_url !== 'string') {
    throw new DomainError('Recommendation URL must be a string or null');
  }
  if (fees_url !== undefined && fees_url !== null && typeof data.recommendation_url !== 'string') {
    throw new DomainError('Fees URL must be a string or null');
  }
}
