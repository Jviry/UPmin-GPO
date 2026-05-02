import express from 'express';
import { prisma } from '../db/db.js';
import { createCourseRepository } from '../repository/course.repository.js';
import { createCourseUsecase } from '../usecase/course/createCourse.usecase.js';

const router = express.Router();

const courseRepo = createCourseRepository(prisma);
const addCourse = createCourseUsecase(courseRepo);

router.post('/course', async (req, res) => {
  try {
    const course = await addCourse(req.body);
    console.log(course);
    res.status(200).json({
      message: `Course added successfully!`,
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
