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
        role: 'superadmin',
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

router.use('/test', (req, res) => {
  res.json('test request');
});

export default router;
