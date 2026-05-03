import express from 'express';
import { prisma } from '../db/db.js';
import { createCoursePoolRepository } from '../repository/course-pool.respository.js';
import { createProgramRepository } from '../repository/program.repository.js';
import { createCoursePoolUsecase } from '../usecase/course-pool/createCoursePool.usecase.js';
import { getCoursePoolsUsecase } from '../usecase/course-pool/getCoursePools.usecase.js';
import { getCoursePoolByProgramIDUsecase } from '../usecase/course-pool/getCoursePoolByProgramID.usecase.js';


const router = express.Router();
const coursePoolRepo = createCoursePoolRepository(prisma);
const programRepo = createProgramRepository(prisma);
const addCoursePool = createCoursePoolUsecase({
  coursePoolRepo,
  programRepo
});
const getAllCoursePools = getCoursePoolsUsecase(coursePoolRepo);
const getCoursePoolByProgramID = getCoursePoolByProgramIDUsecase({
  coursePoolRepo,
  programRepo
});

router.post('/course-pool', async (req, res) => {
  try {
    const coursePool = await addCoursePool(req.body);

    res.status(200).json({
      message: "Course pool created successfully",
      coursePool
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.get('/course-pool', async (req, res) => {
  try {
    const coursePools = await getAllCoursePools();

    res.status(200).json({
      message: "Course Pools retrieved",
      coursePools
    })
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.get('/course-pool/:program_id', async (req, res) => {
  try {
    const { program_id } = req.params;
    const coursePools = await getCoursePoolByProgramID(program_id);

    res.status(200).json({
      message: "Course Pools retrieved",
      coursePools
    })
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});
export default router;
