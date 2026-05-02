import express from 'express';
import { prisma } from '../db/db.js';
import { createCourseRepository } from '../repository/course.repository.js';
import { createCourseUsecase } from '../usecase/course/createCourse.usecase.js';
import { getCourseByTypeUsecase } from '../usecase/course/getCourseByType.usecase.js';
import { deleteCourseUsecase } from '../usecase/course/deleteCourse.Usecase.js';

const router = express.Router();

const courseRepo = createCourseRepository(prisma);
const addCourse = createCourseUsecase(courseRepo);
const getCourseByType = getCourseByTypeUsecase(courseRepo);
const deleteCourse = deleteCourseUsecase(courseRepo);

router.get('/course/type', async (req, res) => {
  try {
    const { type } = req.query;
    const courses = await getCourseByType(type);

    res.status(200).json({
      message: `${type} courses retrieved`,
      courses
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/course', async (req, res) => {
  try {
    const course = await addCourse(req.body);
    res.status(200).json({
      message: `${course.type} Course added successfully!`,
      course
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete('/course/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await deleteCourse(id);

    res.status(200).json({
      message: `Course ${deletedCourse.code} deleted successfully`,
      course: deletedCourse
    });
  } catch (error) {
    if (error.isDomainError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
