import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

const router = express.Router();

const facultyRepo = createFacultyRepository(prisma);
const programRepo = createProgramRepository(prisma);
const getFaculty = getFacultyUsecase(facultyRepo);
const createFaculty = createFacultyUsecase(facultyRepo);
const deleteFaculty = deleteFacultyUsecase(facultyRepo);
const updateFaculty = updateFacultyUsecase(facultyRepo);
const syncProgramFaculty = syncProgramFacultyUsecase({ facultyRepo, programRepo });


router.get('/faculty', async (req, res) => {
  try {
    const { position, page, limit } = req.query;
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedLimit = limit ? parseInt(limit, 10) : 10;

    const result = await getFaculty(position, { page: parsedPage, limit: parsedLimit });

    res.status(200).json({
      message: position ? `${position} faculty retrieved successfully` : 'Faculty retrieved successfully',
      faculties: result.faculties,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/faculty', authenticate, authenticateRole(AdminRole.SUPERADMIN, AdminRole.ADMIN), upload.single('photo'), async (req, res) => {
  try {
    const photo = req.file ? req.file.filename : (req.body.photo || null);
    const credentials = typeof req.body.credentials === 'string'
      ? JSON.parse(req.body.credentials)
      : req.body.credentials;

    const faculty = await createFaculty({ ...req.body, photo, credentials });

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
    const photo = req.file ? req.file.filename : (req.body.photo || null);
    const credentials = req.body.credentials
      ? (typeof req.body.credentials === 'string' ? JSON.parse(req.body.credentials) : req.body.credentials)
      : undefined;

    const faculty = await updateFaculty({ id, ...req.body, photo, ...(credentials && { credentials }) });

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
