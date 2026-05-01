import { validateAnnouncementId } from '../../domain/announcement.js';
import { DomainError } from '../../domain/errors.js';

export function deleteAnnouncementUsecase({ announcementRepo }) {
  return async function(id) {
    validateAnnouncementId(id);

    // Check if announcement exists before deleting
    const existing = await announcementRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Announcement with ID ${id} not found`);
    }

    const deletedAnnouncement = await announcementRepo.delete(id);

    return { deletedAnnouncement };
  };
}