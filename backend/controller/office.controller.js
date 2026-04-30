import express from 'express';
import { prisma } from '../db/db.js';
import { createOfficeRepository } from '../repository/office.repository.js';
import { createGetOfficeUsecase } from '../usecase/office/getOffice.Usecase.js';
import { createUpdateOfficeUsecase } from '../usecase/office/updateOffice.Usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { authenticateRole } from '../middleware/authenticateRole.middleware.js';

const router = express.Router();

const officeRepo = createOfficeRepository(prisma);
const getOffice = createGetOfficeUsecase(officeRepo);
const updateOffice = createUpdateOfficeUsecase(officeRepo);

router.get('/office', async (req, res) => {
  try {
    const result = await getOffice(1);

    res.status(200).json({
      message: "Get office successful",
      office: { ...result },
    });

  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/office', authenticate, authenticateRole('superadmin'), async (req, res) => {
  try {
    const result = await updateOffice(req.body);

    res.status(200).json({
      message: "Updated the office!",
      office: { ...result },
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
