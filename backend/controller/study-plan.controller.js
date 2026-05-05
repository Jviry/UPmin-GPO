import express from 'express';
import { prisma } from '../db/db.js';
import { createStudyPlanRepository } from '../repository/study-plan.repository.js';
import { createProgramRepository } from '../repository/program.repository.js';
import { createCourseRepository } from '../repository/course.repository.js';
import { getStudyPlanByProgramIDUSecase } from '../usecase/study-plan/getStudyPlanByProgramID.usecase.js';
import { createStudyPlanUsecase } from '../usecase/study-plan/createStudyPlan.usecase.js';
import { deleteStudyPlanUsecase } from '../usecase/study-plan/deleteStudyPlan.usecase.js';
import { syncStudyPlanCoursesUsecase } from '../usecase/study-plan/syncStudyPlanCourses.usecase.js';


const router = express.Router({ mergeParams: true });

const studyPlanRepo = createStudyPlanRepository(prisma);
const programRepo = createProgramRepository(prisma);
const courseRepo = createCourseRepository(prisma);
const getStudyPlanByProgramID = getStudyPlanByProgramIDUSecase({
  studyPlanRepo,
  programRepo
});
const addStudyPlan = createStudyPlanUsecase({
  studyPlanRepo,
  programRepo
});
const deleteStudyPlan = deleteStudyPlanUsecase(studyPlanRepo);
const syncStudyPlanCourses = syncStudyPlanCoursesUsecase({
  studyPlanRepo,
  courseRepo
});
router.get('/study-plan', async (req, res) => {
  try {
    const { program_id } = req.params;
    const studyPlans = await getStudyPlanByProgramID(program_id);

    res.status(200).json({
      message: `Program ${program_id} study plans retrievd`,
      studyPlans
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/study-plan', async (req, res) => {
  try {
    const { program_id } = req.params;
    const studyPlan = await addStudyPlan({ ...req.body, program_id });

    res.status(200).json({
      message: "Study plan created",
      studyPlan
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});


router.delete('/study-plan/:id', async (req, res) => {
  try {
    const { id: study_plan_id } = req.params;
    const deletedStudyPlan = await deleteStudyPlan(study_plan_id);

    res.status(200).json({
      message: "Study plan deleted",
      deletedStudyPlan
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/study-plan/:id/entries', async (req, res) => {
  try {
    const { id: study_plan_id } = req.params;
    const { courses } = req.body;
    const programCourses = await syncStudyPlanCourses({ study_plan_id, entryCourses: courses });

    res.status(200).json({
      message: `Study Plan Courses saved!`,
      studyPlanCourses: programCourses,
    })
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
