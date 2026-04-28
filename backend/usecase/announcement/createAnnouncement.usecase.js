import { validateCreateAnnouncement } from '../../domain/announcement.js';

export function createAnnouncementUsecase({ announcementRepo }) {
  return async function({ title, content_description, admin_id }) {
    validateCreateAnnouncement({ title, content_description, admin_id });

    const newAnnouncement = await announcementRepo.create({
      title,
      content_description,
      admin_id,
    });

    return { newAnnouncement };
  };
}
