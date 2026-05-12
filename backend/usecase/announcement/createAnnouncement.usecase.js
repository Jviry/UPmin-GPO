import { validateCreateAnnouncement } from '../../domain/announcement.js';

export function createAnnouncementUsecase({ announcementRepo }) {
  return async function({ title, content_description, admin_id, file }) {
    validateCreateAnnouncement({ title, content_description, admin_id });

    const image_url = file ? `/uploads/${file.filename}` : null;
    const newAnnouncement = await announcementRepo.create({
      title,
      content_description,
      admin_id,
      image_url,
    });

    return { newAnnouncement };
  };
}
