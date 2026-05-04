import express from 'express';
import { prisma } from '../db/db.js';
import { createStudyPlanRepository } from '../repository/study-plan.repository.js';
import { createProgramRepository } from '../repository/program.repository.js';
import { getStudyPlanByProgramIDUSecase } from '../usecase/study-plan/getStudyPlanByProgramID.usecase.js';
import { createStudyPlanUsecase } from '../usecase/study-plan/createStudyPlan.usecase.js';


const router = express.Router({ mergeParams: true });

const studyPlanRepo = createStudyPlanRepository(prisma);
const programRepo = createProgramRepository(prisma);
const getStudyPlanByProgramID = getStudyPlanByProgramIDUSecase({
  studyPlanRepo,
  programRepo
});
const addStudyPlan = createStudyPlanUsecase({
  studyPlanRepo,
  programRepo
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
    res.status(500).json({ message: error.message });
  }
});

export default router;
