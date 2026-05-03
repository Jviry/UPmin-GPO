import express from 'express';
import { prisma } from '../db/db.js';
import { createCoursePoolRepository } from '../repository/course-pool.respository.js';
import { createProgramRepository } from '../repository/program.repository.js';
import { createCoursePoolUsecase } from '../usecase/course-pool/createCoursePool.usecase.js';

const router = express.Router();
const coursePoolRepo = createCoursePoolRepository(prisma);
const programRepo = createProgramRepository(prisma);
const addCoursePool = createCoursePoolUsecase({
  coursePoolRepo,
  programRepo
})

router.post('/course-pool', async (req, res) => {
  try {
    const coursePool = await addCoursePool(req.body);

    res.status(200).json({
      message: "Course pool created successfully",
      coursePool
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
