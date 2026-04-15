import express from 'express';
import { prisma } from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { createAdminRepository } from '../repository/admin.repository.js';
import { createLoginUsecase } from '../usecase/admin/login.usecase.js';
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
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
      },
    });

    res.status(200).json({
      message: "Admin created",
      newAdmin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admins/:id', authenticate, authenticateRole('superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password required" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedAdmin = await prisma.admin.update({
      where: { admin_id: Number(id) },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({
      message: `Admin ${id} password updated`,
      updatedAdmin,
    });
  } catch (error) {
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
