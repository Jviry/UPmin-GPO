export function getAnnouncementsUsecase({ announcementRepo }) {
  return async function() {

    const announcements = await announcementRepo.findAnnouncements();

    return { announcements };
  };
}
