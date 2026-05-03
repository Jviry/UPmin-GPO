import { prisma } from '../db/db.js';

async function main() {
  // =======================
  // OFFICE
  // =======================
  await prisma.office.create({
    data: {
      logo: '/public/seed-assets/office/default-logo.png',
      mission: 'Provide high-quality graduate education.',
      vision: 'To be a center of excellence in research.',
      core_values: 'Integrity, Excellence, Innovation',
      history: 'Established to oversee all graduate programs.',
      phone: '123-4567',
      email: 'grad@university.edu',

      featuredPhotos: {
        create: [
          { url: '/public/seed-assets/office/photo1.jpg' },
          { url: '/public/seed-assets/office/photo2.jpg' }
        ]
      }
    }
  });

  // =======================
  // COLLEGE + DEPARTMENTS
  // =======================
  const college = await prisma.college.create({
    data: {
      name: "College of Science and Mathematics",
      current_dean: "Dr. Maria Santos",

      departments: {
        create: [
          {
            name: "Computer Science",
            head: "Dr. Juan Dela Cruz",
            contact_info: "cs@university.edu",

            faculty: {
              create: [
                {
                  name: "Dr. Maria Santos",
                  email: "maria.santos@univ.edu",
                  photo: "https://example.com/maria.jpg",
                  position: "Program Coordinator",
                  university_graduated: "UP Diliman"
                },
                {
                  name: "Prof. Juan Dela Cruz",
                  email: "juan.delacruz@univ.edu",
                  photo: "https://example.com/juan.jpg",
                  position: "Program Coordinator",
                  university_graduated: "Ateneo"
                }
              ]
            }
          }
        ]
      }
    },
    include: { departments: true }
  });

  const departmentId = college.departments[0].department_id;

  // =======================
  // COURSES
  // =======================
  await prisma.course.createMany({
    data: [
      { name: "Data Structures", code: "CMSC 127", type: "core", units: 3 },
      { name: "Algorithms", code: "CMSC 128", type: "core", units: 3 },
      { name: "Database Systems", code: "CMSC 131", type: "core", units: 3 },
      { name: "Operating Systems", code: "CMSC 132", type: "core", units: 3 },
      { name: "Software Engineering", code: "CMSC 198", type: "core", units: 3 },
      { name: "Computer Networks", code: "CMSC 135", type: "core", units: 3 },
      { name: "Thesis", code: "CMSC 200", type: "core", units: 6 },
      { name: "Machine Learning", code: "CMSC 180", type: "pool", units: 3 },
      { name: "Computer Vision", code: "CMSC 181", type: "pool", units: 3 },
      { name: "Natural Language Processing", code: "CMSC 182", type: "pool", units: 3 },
    ]
  });

  const courses = await prisma.course.findMany();
  const getCourse = (code) => courses.find(c => c.code === code);

  // =======================
  // PROGRAM
  // =======================
  const program = await prisma.program.create({
    data: {
      type: "Graduate Program",
      name: "MS Computer Science",
      description: "Advanced study in computer science.",
      history: "Established for advanced computing research.",
      qualifications: "BS Computer Science or related field.",
      application_instructions: "Submit documents and pass evaluation.",
      application_url: "https://example.com/apply",
      department_id: departmentId,
    }
  });

  // =======================
  // COURSE POOL
  // =======================
  const coursePool = await prisma.coursePool.create({
    data: {
      course_pool_name: "Specialization Electives",
      program_id: program.program_id,

      entries: {
        create: [
          { course_id: getCourse("CMSC 180").course_id },
          { course_id: getCourse("CMSC 181").course_id },
          { course_id: getCourse("CMSC 182").course_id },
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
      program_id: program.program_id,
    }
  });

  // =======================
  // PROGRAM COURSES
  // =======================
  await prisma.programCourse.createMany({
    data: [
      // Year 1 Sem 1
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 127").course_id, year: 1, semester: 1, is_elective_slot: false },
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 128").course_id, year: 1, semester: 1, is_elective_slot: false },
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 131").course_id, year: 1, semester: 1, is_elective_slot: false },

      // Year 1 Sem 2
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 132").course_id, year: 1, semester: 2, is_elective_slot: false },
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 135").course_id, year: 1, semester: 2, is_elective_slot: false },

      // Year 2 Sem 1
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 198").course_id, year: 2, semester: 1, is_elective_slot: false },
      // elective slot — student picks from pool
      { study_plan_id: studyPlan.study_plan_id, course_id: null, year: 2, semester: 1, is_elective_slot: true },

      // Year 2 Sem 2
      { study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 200").course_id, year: 2, semester: 2, is_elective_slot: false },
      // elective slot — student picks from pool
      { study_plan_id: studyPlan.study_plan_id, course_id: null, year: 2, semester: 2, is_elective_slot: true },
    ]
  });

  // =======================
  // ADMIN + ANNOUNCEMENTS
  // =======================
  await prisma.admin.create({
    data: {
      email: "superadmin@gmail.com",
      name: "Super Admin",
      password: "$2a$10$n/eU5FSZBdSC/K5HHv/HTuiGStK6CPSVmP1JXhmDOGuVZvlt7Rivq",
      role: "superadmin",

      announcements: {
        create: [
          {
            title: "Welcome to Graduate Studies",
            content_description: "We are excited to welcome students."
          },
          {
            title: "Application Deadline Extended",
            content_description: "Deadline extended by two weeks."
          }
        ]
      }
    }
  });

  console.log("✅ Seed data inserted!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
