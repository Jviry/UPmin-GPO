import { DomainError } from './errors.js';

export function validateCreateAnnouncement({ title, content_description, admin_id }) {
  if (!title || title.trim() === '') {
    throw new DomainError('Title is required');
  }
  if (!content_description || content_description.trim() === '') {
    throw new DomainError('Content description is required');
  }
  if (!admin_id) {
    throw new DomainError('Admin ID is required');
  }
}

export function validateAnnouncementId(id) {
  if (!id) {
    throw new DomainError('Announcement ID is required');
  }
  if (isNaN(parseInt(id))) {
    throw new DomainError('Invalid announcement ID');
  }
}

export function validateAnnouncementUpdates(updates) {
  const allowed = ['title', 'content_description']
  const invalid = Object.keys(updates).filter(key => !allowed.includes(key));

  if (invalid.lenth > 0) {
    throw new DomainError(`Invalid fields: ${invalid.join(', ')}`);
  }
}
