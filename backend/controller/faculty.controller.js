import express from 'express';
import { prisma } from '../db/db.js';
import { createFacultyRepository } from '../repository/faculty.repository.js';
import { getFacultyByPositionUsecase } from '../usecase/faculty/getFacultyByPosition.usecase.js';
import { validateFacultyPosition } from '../domain/faculty.js';

const router = express.Router();

const facultyRepo = createFacultyRepository(prisma);
const getFacultyByPosition = getFacultyByPositionUsecase(facultyRepo);

router.get('/faculty', async (req, res) => {
  try {
    const { position } = req.query;
    validateFacultyPosition(position);

    const result = await getFacultyByPosition(position);

    res.status(200).json({
      message: `${position} from faculty retrieved successfully`,
      faculty: result.faculty,
    })
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
