import express from 'express';
import { prisma } from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { createAdminRepository } from '../repository/admin.repository.js';
import { createLoginUsecase } from '../usecase/auth/login.usecase.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

const router = express.Router();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
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
    const result = await login(req.body);
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

// Update own name/email
router.put('/auth/profile', authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name?.trim() && !email?.trim()) {
      return res.status(400).json({ message: 'At least one field is required' });
    }

    if (email) {
      const taken = await adminRepo.findByEmail(email);
      if (taken && taken.admin_id !== req.user.admin_id) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    const admin = await adminRepo.update(req.user.admin_id, { name, email });
    res.status(200).json({ message: 'Profile updated', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change own password
router.put('/auth/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    const admin = await adminRepo.findByID(req.user.admin_id);
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    if (newPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const isSame = await bcrypt.compare(newPassword, admin.password);
    if (isSame) return res.status(400).json({ message: 'New password must differ from current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await adminRepo.update(req.user.admin_id, { hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
