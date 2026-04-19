import express from 'express';
import { prisma } from '../db/db.js';
import { createProgramRepository } from '../repository/program.repository.js';
import { createGetProgramUsecase } from '../usecase/program/getPrograms.usecase.js';

const router = express.Router();

const programRepo = createProgramRepository(prisma);
const getPrograms = createGetProgramUsecase(programRepo);

router.get('/programs', async (req, res) => {
  try {
    const result = getPrograms();

    res.status(200).json({
      message: "Got the programs brah",
      ...result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
