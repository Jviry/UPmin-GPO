import express from 'express';
import { prisma } from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { createAdminRepository } from '../repository/admin.repository.js';
import { createLoginUsecase } from '../usecase/admin/login.usecase.js';

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
