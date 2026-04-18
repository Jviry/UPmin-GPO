import express from 'express';
import { prisma } from '../db/db.js';
import { createOfficeRepository } from '../repository/office.repository.js';
import { createGetOfficeUsecase } from '../usecase/office/getOffice.Usecase.js';

const router = express.Router();

const officeRepo = createOfficeRepository(prisma);
const getOffice = createGetOfficeUsecase(officeRepo);

router.get('/office', async (req, res) => {
  try {
    const result = await getOffice(1);

    res.status(200).json({
      message: "Get office successful",
      ...result
    });

  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
