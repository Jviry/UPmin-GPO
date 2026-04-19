import express from 'express';
import { prisma } from '../db/db.js';
import { createAnnouncementRepository } from '../repository/announcement.repository.js';
import { createAnnouncementUsecase } from '../usecase/announcement/createAnnouncement.usecase.js';
import { deleteAnnouncementUsecase } from '../usecase/announcement/deleteAnnouncement.usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

const router = express.Router();

const announcementRepo = createAnnouncementRepository(prisma);
const createAnnouncement = createAnnouncementUsecase({ announcementRepo });
const deleteAnnouncement = deleteAnnouncementUsecase({ announcementRepo });

// A. Create announcement (authenticated admin only)
router.post('/announcements', authenticate, async (req, res) => {
  try {
    const admin_id = req.user.admin_id;
    const { title, content_description } = req.body;

    const result = await createAnnouncement({
      title,
      content_description,
      admin_id,
    });

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: result.announcement,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Create announcement error:', error);
    res.status(500).json({ message: error.message });
  }
});

// B. Delete announcement
router.delete('/announcements/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteAnnouncement(id);

    res.status(200).json({
      message: `Announcement ${id} deleted successfully`,
      deletedAnnouncement: result.deletedAnnouncement,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;