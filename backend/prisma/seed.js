import { prisma } from '../db/db.js';

async function main() {

  // =======================
  // ADMIN
  // =======================
  const admin = await prisma.admin.create({
    data: {
      email: "superadmin@gmail.com",
      name: "Super Admin",
      password: "$2a$10$u4/XG0PzzTNPWcCtYuzywuHAIrg23ia4tmPB6WSAnuna/a5UdZoAu",
      role: "superadmin",
    }
  });

  // =======================
  // OFFICE
  // =======================
  await prisma.office.create({
    data: {
      logo: '/public/seed-assets/office/default-logo.png',
      mission: 'Provide high-quality graduate education.',
      vision: 'Center of excellence in research.',
      core_values: 'Integrity, Excellence, Innovation',
      history: 'Graduate office history...',
      phone: '123-4567',
      email: 'grad@university.edu',
      org_chart_url: '/public/seed-assets/office/chart.png',
      featuredPhotos: {
        create: [
          { url: '/public/seed-assets/office/photo1.jpg' },
          { url: '/public/seed-assets/office/photo2.jpg' }
        ]
      }
    }
  });

  // =======================
  // DEPARTMENT
  // =======================
  const department = await prisma.department.create({
    data: {
      name: "Computer Science",
      contact_info: "cs@university.edu"
    }
  });

  // =======================
  // FACULTY + CREDENTIALS
  // =======================
  const faculty = await prisma.faculty.create({
    data: {
      name: "Dr. Maria Santos",
      email: "maria@univ.edu",
      photo: "photo.jpg",
      position: "Program Coordinator",
      credentials: {
        create: [
          { degree: "BS Computer Science" },
          { degree: "MS Computer Science" },
          { degree: "PhD Computer Science" }
        ]
      }
    }
  });

  // =======================
  // COURSES
  // =======================
  await prisma.course.createMany({
    data: [
      { name: "Data Structures", code: "CMSC127", type: "core", units: 3 },
      { name: "Algorithms", code: "CMSC128", type: "core", units: 3 },
      { name: "Database Systems", code: "CMSC131", type: "core", units: 3 },
      { name: "Operating Systems", code: "CMSC132", type: "core", units: 3 },
      { name: "Software Engineering", code: "CMSC198", type: "core", units: 3 },
      { name: "Networks", code: "CMSC135", type: "core", units: 3 },
      { name: "Thesis", code: "CMSC200", type: "core", units: 6 },
      { name: "Machine Learning", code: "CMSC180", type: "pool", units: 3 },
      { name: "Computer Vision", code: "CMSC181", type: "pool", units: 3 },
      { name: "NLP", code: "CMSC182", type: "pool", units: 3 },
    ],
    skipDuplicates: true
  });

  const courses = await prisma.course.findMany();

  const getCourse = (code) => {
    const c = courses.find(x => x.code === code);
    if (!c) throw new Error(`Course ${code} not found`);
    return c;
  };

  // =======================
  // PROGRAM + APPLICATION
  // =======================
  const program = await prisma.program.create({
    data: {
      type: "Graduate Program",
      name: "MS Computer Science",
      description: "Advanced CS program",
      history: "Program history...",
      department_id: department.department_id,

      program_application: {
        create: {
          qualifications: "BS CS or related",
          application_instructions: "Submit docs",
          application_url: "https://apply.com",
          recommendation_url: "https://reco.com"
        }
      }
    },
    include: {
      program_application: true
    }
  });

  // =======================
  // COURSE POOL
  // =======================
  await prisma.coursePool.create({
    data: {
      name: "Electives",
      program_id: program.program_id,
      entries: {
        create: [
          { course_id: getCourse("CMSC180").course_id },
          { course_id: getCourse("CMSC181").course_id },
          { course_id: getCourse("CMSC182").course_id },
        ]
      }
    }
  });

  // =======================
  // STUDY PLAN
  // =======================
  const studyPlan = await prisma.studyPlan.create({
    data: {
      years: 2,
      name: "Standard Plan",
      program_id: program.program_id,
    }
  });

  // =======================
  // PROGRAM COURSES
  // =======================
  await prisma.programCourse.createMany({
    data: [
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC127").course_id, year: 1, semester: 1 },
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC128").course_id, year: 1, semester: 1 },
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC131").course_id, year: 1, semester: 1 },

      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC132").course_id, year: 1, semester: 2 },
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC135").course_id, year: 1, semester: 2 },

      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC198").course_id, year: 2, semester: 1 },
      { study_plan_id: studyPlan.study_plan_id, course_id: null, year: 2, semester: 1, is_elective_slot: true },

      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC200").course_id, year: 2, semester: 2 },
      { study_plan_id: studyPlan.study_plan_id, course_id: null, year: 2, semester: 2, is_elective_slot: true },
    ]
  });

  // =======================
  // SCHOLARSHIPS
  // =======================
  await prisma.scholarship.create({
    data: {
      name: "CHED Scholarship",
      description: "Government scholarship",
      covered_programs: "MSCS",
      application_instructions: "Apply online",
      application_url: "https://ched.gov.ph",
      contact_info: "ched@test.com",
      admin_id: admin.admin_id
    }
  });

  // =======================
  // ANNOUNCEMENTS
  // =======================
  await prisma.announcement.createMany({
    data: [
      {
        title: "Welcome!",
        content_description: "Welcome students",
        admin_id: admin.admin_id
      },
      {
        title: "Deadline Extended",
        content_description: "More time to apply",
        admin_id: admin.admin_id
      }
    ]
  });

  // =======================
  // TESTIMONIES
  // =======================
  await prisma.testimony.createMany({
    data: [
      {
        alumnus_name: "Juan Dela Cruz",
        testimony_description: "Great program!",
        alumnus_graduate_program: "MSCS"
      },
      {
        alumnus_name: "Maria Santos",
        testimony_description: "Very helpful",
        alumnus_graduate_program: "MSCS"
      }
    ]
  });

  console.log("✅ FULL SEED COMPLETE");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
