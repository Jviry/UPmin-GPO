import express from 'express';
import { prisma } from '../db/db.js';
import { createCoursePoolRepository } from '../repository/course-pool.respository.js';
import { createProgramRepository } from '../repository/program.repository.js';
import { createCoursePoolUsecase } from '../usecase/course-pool/createCoursePool.usecase.js';
import { createCourseRepository } from '../repository/course.repository.js';
import { getCoursePoolsUsecase } from '../usecase/course-pool/getCoursePools.usecase.js';
import { getCoursePoolByProgramIDUsecase } from '../usecase/course-pool/getCoursePoolByProgramID.usecase.js';
import { syncCoursePoolEntriesUsecase } from '../usecase/course-pool/syncCoursePoolEntries.usecase.js';


const router = express.Router();
const coursePoolRepo = createCoursePoolRepository(prisma);
const programRepo = createProgramRepository(prisma);
const courseRepo = createCourseRepository(prisma);
const addCoursePool = createCoursePoolUsecase({
  coursePoolRepo,
  programRepo
});
const getAllCoursePools = getCoursePoolsUsecase(coursePoolRepo);
const getCoursePoolByProgramID = getCoursePoolByProgramIDUsecase({
  coursePoolRepo,
  programRepo
});
const syncPoolEntries = syncCoursePoolEntriesUsecase({
  coursePoolRepo,
  courseRepo
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

router.post('/course-pool/:id/entries', async (req, res) => {
  try {
    const { id: course_pool_id } = req.params.id;
    const course_ids = req.body;
    const entries = await syncPoolEntries({ course_pool_id, course_ids });

    res.status(200).json({
      message: `Course Pool Entries saved!`,
      coursePoolEntries: entries,
    })
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});
export default router;
