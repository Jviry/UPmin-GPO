import express from 'express';
import { prisma } from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { authenticateRole } from '../middleware/authenticateRole.middleware.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
if (!JWT_SECRET) {
  console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json('Email invalid!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('Invalid password Desu ga');
    }

    const token = jwt.sign(
      { admin_id: user.admin_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Logged in successfully",
      token
    });
  } catch (error) {
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
    const deletedUser = await prisma.user.delete({
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

// Test
router.get('/colleges', async (req, res) => {
  try {
    const colleges = await prisma.college.findMany();
    res.json(colleges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

export default router;
