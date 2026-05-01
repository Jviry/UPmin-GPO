import express from 'express';
import { prisma } from '../db/db.js';
import { createCourseRepository } from '../repository/course.repository.js';
import { createCoreCourseUsecase } from '../usecase/course/createCoreCourse.usecase.js';

const router = express.Router();

const courseRepo = createCourseRepository(prisma);
const addCoreCourse = createCoreCourseUsecase(courseRepo);

router.post('/course', async (req, res) => {
  try {
    const { type, ...courseData } = req.body;

    let course;

    if (type === "core") {
      course = await addCoreCourse(courseData);
    } else if (type === "elective") {

    } else {
      return res.status(400).json({ message: "Invalid course type" })
    }

    res.status(200).json({
      message: `{type} Course added successfully!`,
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
