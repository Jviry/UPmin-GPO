import express from 'express';
import { prisma } from '../db/db.js';
import { createAnnouncementRepository } from '../repository/announcement.repository.js';
import { createAnnouncementUsecase } from '../usecase/announcement/createAnnouncement.usecase.js';
import { deleteAnnouncementUsecase } from '../usecase/announcement/deleteAnnouncement.usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { updateAnnouncementUsecase } from '../usecase/announcement/updateAnnouncement.usecase.js';
import { getAnnouncementByIdUsecase } from '../usecase/announcement/getAnnouncementById.usecase.js';

const router = express.Router();

const announcementRepo = createAnnouncementRepository(prisma);
const createAnnouncement = createAnnouncementUsecase({ announcementRepo });
const deleteAnnouncement = deleteAnnouncementUsecase({ announcementRepo });
const updateAnnouncement = updateAnnouncementUsecase({ announcementRepo });
const getAnnouncementById = getAnnouncementByIdUsecase({ announcementRepo });

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

    res.status(200).json({
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

// B. Get announcement by ID 
router.get('/announcements/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getAnnouncementById(id);

    res.status(200).json({
      message: `Announcement ${id} retrieved successfully`,
      announcement: result.announcement,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Get announcement error:', error);
    res.status(500).json({ message: error.message });
  }
});

// C. Update announcement (authenticated admin only)
router.put('/announcements/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content_description } = req.body;

    const result = await updateAnnouncement(id, { title, content_description });

    res.status(200).json({
      message: `Announcement ${id} updated successfully`,
      announcement: result.announcement,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Update announcement error:', error);
    res.status(500).json({ message: error.message });
  }
});

// D. Delete announcement
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