import express from 'express';
import { prisma } from '../db/db.js';
import { DomainError } from '../domain/errors.js';

const router = express.Router();

// MOVE TO DOMAIN LATER
function validateCreateAnnouncement({ title, content_description, admin_id }) {
  if (!title || title.trim() === '') {
    throw new DomainError('Title is required');
  }
  if (!content_description || content_description.trim() === '') {
    throw new DomainError('Content description is required');
  }
  if (!admin_id) {
    throw new DomainError('Admin ID is required');
  }
}

function validateAnnouncementId(id) {
  if (!id) {
    throw new DomainError('Announcement ID is required');
  }
  if (isNaN(parseInt(id))) {
    throw new DomainError('Invalid announcement ID');
  }
}

// MOVE TO REPOSITORY LATER
const createAnnouncementRepository = (prisma) => {
  return {
    async create({ title, content_description, admin_id }) {
      return prisma.announcement.create({
        data: {
          title,
          content_description,
          admin_id: parseInt(admin_id),
        },
        include: {
          admin: {
            select: {
              admin_id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    },

    async delete(id) {
      return prisma.announcement.delete({
        where: {
          announcement_id: parseInt(id),
        },
      });
    },

    async findByID(id) {
      return prisma.announcement.findUnique({
        where: {
          announcement_id: parseInt(id),
        },
      });
    },
  };
};

// MOVE TO USECASE LATER
const createCreateAnnouncementUsecase = ({ announcementRepo }) => {
  return async function({ title, content_description, admin_id }) {
    validateCreateAnnouncement({ title, content_description, admin_id });

    const newAnnouncement = await announcementRepo.create({
      title,
      content_description,
      admin_id,
    });

    return { announcement: newAnnouncement };
  };
};

const createDeleteAnnouncementUsecase = ({ announcementRepo }) => {
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
};

// KEEP HERE
const announcementRepo = createAnnouncementRepository(prisma);
const createAnnouncement = createCreateAnnouncementUsecase({ announcementRepo });
const deleteAnnouncement = createDeleteAnnouncementUsecase({ announcementRepo });

// A. Create announcement
router.post('/announcements', async (req, res) => {
  try {
    const { title, content_description, admin_id } = req.body;

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

// Delete announcement (authenticated admin only)
router.delete('/announcements/:id', async (req, res) => {
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