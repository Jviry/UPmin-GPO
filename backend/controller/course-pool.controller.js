import express from 'express';
import { prisma } from '../db/db.js';
import { createCoursePoolRepository } from '../repository/course-pool.respository.js';

const router = express.Router();
const coursePoolRepo = createCoursePoolRepository(prisma);

router.post('/course-pool', async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
