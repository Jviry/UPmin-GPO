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

// INITIALIZE REPOSITORY and USECASES 
const announcementRepo = createAnnouncementRepository(prisma);
const createAnnouncement = createCreateAnnouncementUsecase({ announcementRepo });

// KEEP HERE IN CONTROLLER
// A. Create announcement
router.post('/announcements', async (req, res) => {
  try {
    const { title, content_description, admin_id } = req.body;

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

export default router;