import { validateAnnouncementId, validateAnnouncementUpdates } from '../../domain/announcement.js';
import { DomainError } from '../../domain/errors.js';

export function updateAnnouncementUsecase({ announcementRepo, deleteFile }) {
  return async function(id, updates, file) { 
    validateAnnouncementId(id);
    
    // Validate updates if there are any fields other than image_url
    const { image_url: existingImageUrl, ...otherUpdates } = updates;
    if (Object.keys(otherUpdates).length > 0) {
      validateAnnouncementUpdates(otherUpdates);
    }

    // Check if announcement exists before updating
    const existing = await announcementRepo.findByID(id);
    if (!existing) {
      throw new DomainError(`Announcement with ID ${id} not found`);
    }

    if (file && existing.image_url) {
      deleteFile(existing.image_url);
    }

    const newImageUrl = file ? `/uploads/${file.filename}` : existing.image_url;  // ← Renamed to newImageUrl

    const updateData = {
      ...updates,
      image_url: newImageUrl && newImageUrl.trim() !== '' ? newImageUrl : null,
    };

    const updatedAnnouncement = await announcementRepo.update(id, updateData);

    return { updatedAnnouncement };
  };
}