import express from 'express';
import { prisma } from '../db/db.js';
import { createScholarshipRepository } from '../repository/scholarship.repository.js';
import { getAllScholarshipsUsecase } from '../usecase/scholarship/getAllScholarships.usecase.js';
import { createScholarshipUsecase } from '../usecase/scholarship/createScholarship.usecase.js';
import { updateScholarshipUsecase } from '../usecase/scholarship/updateScholarship.usecase.js';
import { deleteScholarshipUsecase } from '../usecase/scholarship/deleteScholarship.usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

const router = express.Router();

const scholarshipRepo = createScholarshipRepository(prisma);

const getAllScholarships = getAllScholarshipsUsecase({ scholarshipRepo });
const createScholarship = createScholarshipUsecase({ scholarshipRepo });
const updateScholarship = updateScholarshipUsecase({ scholarshipRepo });
const deleteScholarship = deleteScholarshipUsecase({ scholarshipRepo });

// Public routes
router.get('/scholarships', async (req, res) => {
  try {
    const result = await getAllScholarships();

    res.status(200).json({
      message: 'Scholarships retrieved successfully',
      count: result.scholarships.length,
      scholarships: result.scholarships,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Get all scholarships error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Protected routes
router.post('/admin/scholarships', authenticate, async (req, res) => {
  try {
    const admin_id = req.user.admin_id;
    const scholarshipData = {
      ...req.body,
      admin_id: admin_id
    };

    const result = await createScholarship(scholarshipData);

    res.status(200).json({
      message: 'New scholarship created successfully',
      scholarship: result.scholarship,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Create scholarship error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/scholarships/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateScholarship(id, req.body);

    res.status(200).json({
      message: `Scholarship ${id} updated successfully`,
      scholarship: result.scholarship,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Update scholarship error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/scholarships/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteScholarship(id);

    res.status(200).json({
      message: `Scholarship ${id} deleted successfully`,
      deletedScholarship: result.deletedScholarship,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Delete scholarship error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;