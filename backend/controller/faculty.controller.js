import express from 'express';
import { prisma } from '../db/db.js';
import { createFacultyRepository } from '../repository/faculty.repository.js';
import { getFacultyUsecase } from '../usecase/faculty/getFaculty.usecase.js';
import { createFacultyUsecase } from '../usecase/faculty/createFaculty.usecase.js';
import { deleteFacultyUsecase } from '../usecase/faculty/deleteFaculty.usecase.js';
import { updateFacultyUsecase } from '../usecase/faculty/updateFaculty.usecase.js';

const router = express.Router();

const facultyRepo = createFacultyRepository(prisma);
const getFaculty = getFacultyUsecase(facultyRepo);
const createFaculty = createFacultyUsecase(facultyRepo);
const deleteFaculty = deleteFacultyUsecase(facultyRepo);
const updateFaculty = updateFacultyUsecase(facultyRepo);


router.get('/faculty', async (req, res) => {
  try {
    const { position } = req.query;

    const faculties = await getFaculty(position);

    res.status(200).json({
      message: position ? `${position} faculty retrieved successfully` : 'Faculty retrieved successfully',
      faculties
    })
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/faculty', async (req, res) => {
  try {
    const faculty = await createFaculty(req.body);

    res.status(200).json({
      message: "Faculty Created!",
      faculty
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete('faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await deleteFaculty(id);
    res.status(200).json({
      message: "Faculty Deleted",
      faculty
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = updateFaculty({ id, ...req.body });

    res.status(200).json({
      message: `Faculty ${id} updated successfully`,
      faculty
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
