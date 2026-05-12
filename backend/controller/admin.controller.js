import express from 'express';
import { prisma } from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createAdminRepository } from '../repository/admin.repository.js';
import { createAdminUsecase } from '../usecase/admin/createAdmin.usecase.js';
import { createUpdateAdminUsecase } from '../usecase/admin/updateAdmin.usecase.js';
import { createDeleteAdminUsecase } from '../usecase/admin/deleteAdmin.usecase.js';
import { createGetAdminsUsecase } from '../usecase/admin/getAdmins.usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { authenticateRole } from '../middleware/authenticateRole.middleware.js';
import { AdminRole } from '../domain/admin.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
if (!JWT_SECRET) {
  console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

const adminRepo = createAdminRepository(prisma);


const createAdmin = createAdminUsecase({
  adminRepo,
  hashPassword: (pw) => bcrypt.hash(pw, 10)
});

const updateAdmin = createUpdateAdminUsecase({
  adminRepo,
  hashPassword: (pw) => bcrypt.hash(pw, 10),
});

const deleteAdmin = createDeleteAdminUsecase(
  adminRepo
);

const getAdmins = createGetAdminsUsecase(
  adminRepo
);

router.post('/admins', authenticate, authenticateRole(AdminRole.SUPERADMIN), async (req, res) => {
  try {
    const admin = await createAdmin(req.body);
    res.status(200).json({
      message: "Admin created",
      admin
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/auth/verify-password', authenticate, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const admin = await adminRepo.findByID(req.user.admin_id);
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    res.status(200).json({ message: 'Password verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admins/:id', authenticate, authenticateRole(AdminRole.SUPERADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, newPassword } = req.body;

    const admin = await updateAdmin(id, { name, email, role, newPassword });

    res.status(200).json({
      message: `Admin ${id} updated`,
      admin,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admins/:id', authenticate, authenticateRole(AdminRole.SUPERADMIN), async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await deleteAdmin(id);

    res.status(200).json({
      message: `User ${id} deleted successfully!`,
      deletedAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admins', authenticate, authenticateRole(AdminRole.SUPERADMIN), async (req, res) => {
  try {
    const admins = await getAdmins();

    res.status(200).json({
      message: "Fetched admins successfully",
      admins
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
