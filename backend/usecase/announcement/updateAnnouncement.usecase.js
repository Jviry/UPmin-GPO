import { validateAnnouncementId, validateAnnouncementUpdates } from '../../domain/announcement.js';
import { DomainError } from '../../domain/errors.js';

export function updateAnnouncementUsecase({ announcementRepo }) {
  return async function(id, updates) {
    validateAnnouncementId(id);
    validateAnnouncementUpdates(updates);

    // Check if announcement exists before updating
    const existing = await announcementRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Announcement with ID ${id} not found`);
    }

    const updatedAnnouncement = await announcementRepo.update(id, updates);

    return { updatedAnnouncement };
  };
}
