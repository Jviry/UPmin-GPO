import express from 'express';
import { prisma } from '../db/db.js';
import { createFacultyRepository } from '../repository/faculty.repository.js';
import { createProgramRepository } from '../repository/program.repository.js';
import { getFacultyUsecase } from '../usecase/faculty/getFaculty.usecase.js';
import { createFacultyUsecase } from '../usecase/faculty/createFaculty.usecase.js';
import { deleteFacultyUsecase } from '../usecase/faculty/deleteFaculty.usecase.js';
import { updateFacultyUsecase } from '../usecase/faculty/updateFaculty.usecase.js';
import { syncProgramFacultyUsecase } from '../usecase/faculty/syncProgramFaculty.usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { authenticateRole } from '../middleware/authenticateRole.middleware.js';
import { AdminRole } from '../domain/admin.js';
import { upload } from '../middleware/upload.middleware.js';
import { deleteFile } from '../utils/deleteFile.util.js';

const router = express.Router();

const facultyRepo = createFacultyRepository(prisma);
const programRepo = createProgramRepository(prisma);
const getFaculty = getFacultyUsecase(facultyRepo);
const createFaculty = createFacultyUsecase(facultyRepo);
const deleteFaculty = deleteFacultyUsecase({ facultyRepo, deleteFile });
const updateFaculty = updateFacultyUsecase({ facultyRepo, deleteFile });
const syncProgramFaculty = syncProgramFacultyUsecase({ facultyRepo, programRepo });


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

router.post('/faculty', authenticate, authenticateRole(AdminRole.SUPERADMIN, AdminRole.ADMIN), upload.single('photo'), async (req, res) => {
  try {
    const faculty = await createFaculty({ ...req.body, file: req.file });

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

router.delete('/faculty/:id', authenticate, authenticateRole(AdminRole.ADMIN, AdminRole.SUPERADMIN), async (req, res) => {
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

router.put('/faculty/:id', authenticate, authenticateRole(AdminRole.ADMIN, AdminRole.SUPERADMIN), upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await updateFaculty({ id, ...req.body, file: req.file });

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

router.put('/programs/:program_id/faculty', authenticate, authenticateRole(AdminRole.ADMIN, AdminRole.SUPERADMIN), async (req, res) => {
  try {
    const { program_id } = req.params;
    const { faculty_ids } = req.body;
    const faculties = await syncProgramFaculty({ program_id, faculty_ids });

    res.status(200).json({
      message: "Program Faculties saved!",
      faculties
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
