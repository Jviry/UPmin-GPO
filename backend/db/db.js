import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

export { prisma };
