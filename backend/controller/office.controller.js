import express from 'express';
import { prisma } from '../db/db.js';
import { createOfficeRepository } from '../repository/office.repository.js';
import { createGetOfficeUsecase } from '../usecase/office/getOffice.Usecase.js';
import { patchOrgChartUsecase } from '../usecase/office/patchOrgChart.usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { authenticateRole } from '../middleware/authenticateRole.middleware.js';
import { AdminRole } from '../domain/admin.js';
import { upload } from '../middleware/upload.middleware.js';
import { deleteFile } from '../utils/deleteFile.util.js';

const router = express.Router();

const officeRepo = createOfficeRepository(prisma);
const getOffice = createGetOfficeUsecase(officeRepo);
const patchOrgChart = patchOrgChartUsecase({ officeRepo, deleteFile });

router.get('/office', async (req, res) => {
  try {
    const result = await getOffice(1);

    res.status(200).json({
      message: "Get office successful",
      office: result.office,
    });

  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.patch('/office', authenticate, authenticateRole(AdminRole.SUPERADMIN, AdminRole.ADMIN), upload.single('orgChart'), async (req, res) => {
  try {
    const orgChartUrl = await patchOrgChart(req.file);

    res.status(200).json({
      message: "Updated the org chart",
      orgChartUrl
    });
  } catch (error) {
    if (req.file) {
      deleteFile(`/uploads/${req.file.filename}`);
    }
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.patch('/office/google-url', authenticate, authenticateRole(AdminRole.SUPERADMIN, AdminRole.ADMIN), async (req, res) => {
  try {
    const { application_google_url } = req.body;
    if (application_google_url === undefined) {
      return res.status(400).json({ message: 'application_google_url field is required' });
    }
    await officeRepo.patchGoogleUrl(1, application_google_url.trim());
    res.status(200).json({ message: 'Google Form URL updated', application_google_url });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
