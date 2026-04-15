import express from 'express';
import { prisma } from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { createAdminRepository } from '../repository/admin.repository.js';
import { createLoginUsecase } from '../usecase/admin/login.usecase.js';
import { createAdminUsecase } from '../usecase/admin/createAdmin.usecase.js';
import { createUpdatePasswordUsecase } from '../usecase/admin/updatePassword.usecase.js'
import { authenticate } from '../middleware/authenticate.middleware.js';
import { authenticateRole } from '../middleware/authenticateRole.middleware.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
if (!JWT_SECRET) {
  console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

const adminRepo = createAdminRepository(prisma);

const login = createLoginUsecase({
  adminRepo,
  comparePassword: bcrypt.compare,
  signToken: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })
});

const createAdmin = createAdminUsecase({
  adminRepo,
  hashPassword: (pw) => bcrypt.hash(pw, 10)
});

const updatePassword = createUpdatePasswordUsecase({
  adminRepo,
  hashPassword: (pw) => bcrypt.hash(pw, 10),
  comparePassword: bcrypt.compare
});

router.post('/auth/login', async (req, res) => {
  try {
    const result = login(req.body);
    res.status(200).json({
      message: "Logged in successfully",
      ...result
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ mesasage: error.message });
  }
});

router.post('/admins', authenticate, authenticateRole('superadmin'), async (req, res) => {
  try {
    const result = createAdmin(req.body);
    res.status(200).json({
      message: "Admin created",
      ...result
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/admins/:id', authenticate, authenticateRole('superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const result = updatePassword(id, newPassword);

    res.status(200).json({
      message: `Admin ${id} password updated`,
      ...result,
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admins/:id', authenticate, authenticateRole('superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.admin.delete({
      where: {
        admin_id: Number(id),
      },
    });
    res.status(200).json({
      message: `User ${id} deleted successfully!`,
      deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
