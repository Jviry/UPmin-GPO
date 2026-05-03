import { validateAnnouncementId } from '../../domain/announcement.js';
import { DomainError } from '../../domain/errors.js';

export function getAnnouncementByIdUsecase({ announcementRepo }) {
  return async function(id) {
    validateAnnouncementId(id);

    const announcement = await announcementRepo.findByID(id);
    
    if (!announcement) {
      throw new DomainError(`Announcement with ID ${id} not found`);
    }

    return { announcement };
  };
}