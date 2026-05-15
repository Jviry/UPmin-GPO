import { DomainError } from './errors.js';

export function validateCreateProgram({ type, name, description, history }) {
  if (!type || !name || !description || !history) throw new DomainError('All fields are required except photo');
}

export function validateProgramId(id) {
  if (!id) throw new DomainError('Program ID is required');
  if (isNaN(parseInt(id))) throw new DomainError('Invalid program ID');
}

// Validate application details but allow partial updates as some fields are optional
export function validateUpdateProgramApplication({ qualifications, application_instructions, application_requirements }) {
  if (!qualifications || qualifications.trim() === '') {
    throw new DomainError('Qualifications is required');
  }
  if (typeof qualifications !== 'string') {
    throw new DomainError('Qualifications must be a string');
  }
  if (!application_instructions || application_instructions.trim() === '') {
    throw new DomainError('Application instructions is required');
  }
  if (typeof application_instructions !== 'string') {
    throw new DomainError('Application instructions must be a string');
  }
  if (!application_requirements || application_requirements.trim() === '') {
    throw new DomainError('Application requirements is required');
  }
  if (typeof application_requirements !== 'string') {
    throw new DomainError('Application requirements must be a string');
  }
}
