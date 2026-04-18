import { DomainError } from './errors.js';

export function validateOfficeUpdate(updates) {
  const allowed = ['name', 'logo', 'objectives', 'location', 'contact_info', 'email'];
  const invalid = Object.keys(updates).filter(key => !allowed.includes(key));

  if (invalid.lenth > 0) {
    throw new DomainError(`Invalid fields: ${invalid.join(', ')}`);
  }
}
