import { DomainError } from './errors.js';

export function validateCreateScholarship(data) {
  if (!data.name || !data.description || !data.covered_programs || !data.application_instructions || !data.application_url || !data.contact_info || !data.admin_id) {
    throw new DomainError('All fields are required');
  }
}

export function validateScholarshipId(id) {
  if (!id) throw new DomainError('Scholarship ID is required');
  if (isNaN(parseInt(id))) throw new DomainError('Invalid scholarship ID');
}

export function validateUpdateScholarship(data) {
  if (!data.name || !data.description || !data.covered_programs || !data.application_instructions || !data.application_url || !data.contact_info) {
    throw new DomainError('All fields are required');
  }
}