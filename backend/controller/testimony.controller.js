import express from 'express';
import { prisma } from '../db/db.js';
import { createTestimonyRepository } from '../repository/testimony.repository.js';
import { getAllTestimoniesUsecase } from '../usecase/testimony/getAllTestimonies.usecase.js';
import { getTestimonyByIdUsecase } from '../usecase/testimony/getTestimonyById.usecase.js';

const router = express.Router();

const testimonyRepo = createTestimonyRepository(prisma);

const getAllTestimonies = getAllTestimoniesUsecase({ testimonyRepo });
const getTestimonyById = getTestimonyByIdUsecase({ testimonyRepo });

// A. Get all testimonies from db (if need to list all testimonies in about page)
router.get('/testimonies', async (req, res) => {
  try {
    const result = await getAllTestimonies();

    res.status(200).json({
      message: 'Testimonies retrieved successfully',
      count: result.testimonies.length,
      testimonies: result.testimonies,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Get all testimonies error:', error);
    res.status(500).json({ message: error.message });
  }
});

// B. Get testimony by ID (if need for specific grad prog)
router.get('/testimonies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getTestimonyById(id);

    res.status(200).json({
      message: `Testimony ${id} retrieved successfully`,
      testimony: result.testimony,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Get testimony by ID error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;