import express from 'express';
import { prisma } from '../db/db.js';
import { createProgramRepository } from '../repository/program.repository.js';
import { createProgramUsecase } from '../usecase/program/createProgram.usecase.js';
import { getAllProgramsUsecase } from '../usecase/program/getAllPrograms.usecase.js';
import { getProgramByIdUsecase } from '../usecase/program/getProgramById.usecase.js';
import { deleteProgramUsecase } from '../usecase/program/deleteProgram.usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

const router = express.Router();

const programRepo = createProgramRepository(prisma);

const createProgram = createProgramUsecase({ programRepo });
const getAllPrograms = getAllProgramsUsecase({ programRepo });
const getProgramById = getProgramByIdUsecase({ programRepo });
const deleteProgram = deleteProgramUsecase({ programRepo });

// Public routes (no authentication required)
router.get('/programs', async (req, res) => {
  try {
    const result = await getAllPrograms();

    res.status(200).json({
      message: 'Programs retrieved successfully',
      count: result.programs.length,
      programs: result.programs,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Get all programs error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/programs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getProgramById(id);

    res.status(200).json({
      message: `Program ${id} retrieved successfully`,
      program: result.program,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Get program by ID error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Protected routes (authentication required)
router.post('/admin/programs', authenticate, async (req, res) => {
  try {
    const result = await createProgram(req.body);

    res.status(200).json({
      message: 'Program created successfully',
      program: result.program,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Create program error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/programs/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProgram(id);

    res.status(200).json({
      message: `Program ${id} deleted successfully`,
      deletedProgram: result.deletedProgram,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Delete program error:', error);
    res.status(500).json({ message: error.message });
  }
});
export default router;