import { validateAnnouncementId, validateUpdateAnnouncement } from '../../domain/announcement.js';
import { DomainError } from '../../domain/errors.js';

export function updateAnnouncementUsecase({ announcementRepo }) {
  return async function(id, { title, content_description }) {
    validateAnnouncementId(id);
    validateUpdateAnnouncement({ title, content_description });

    // Check if announcement exists before updating
    const existing = await announcementRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Announcement with ID ${id} not found`);
    }

    const updatedAnnouncement = await announcementRepo.update(id, {
      title,
      content_description,
    });

    return { announcement: updatedAnnouncement };
  };
}