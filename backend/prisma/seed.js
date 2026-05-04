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
      org_chart_url: '/public/seed-assets/office/GPO-Organizational-Chart.png',

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
    include: {
      departments: true
    }
  });

  const departmentId = college.departments[0].department_id;

  // =======================
  // COURSES
  // =======================
  await prisma.course.createMany({
    data: [
      { name: "Data Structures", code: "CMSC 127", type: "Core", units: 3, department_id: departmentId },
      { name: "Algorithms", code: "CMSC 128", type: "Core", units: 3, department_id: departmentId },
      { name: "Database Systems", code: "CMSC 131", type: "Core", units: 3, department_id: departmentId },
      { name: "Operating Systems", code: "CMSC 132", type: "Core", units: 3, department_id: departmentId },
      { name: "Software Engineering", code: "CMSC 198", type: "Core", units: 3, department_id: departmentId },
      { name: "Machine Learning", code: "CMSC 180", type: "Elective", units: 3, department_id: departmentId },
      { name: "Computer Networks", code: "CMSC 135", type: "Core", units: 3, department_id: departmentId },
      { name: "Thesis", code: "CMSC 200", type: "Capstone", units: 6, department_id: departmentId },
    ]
  });

  const courses = await prisma.course.findMany();
  const getCourse = (code) => courses.find(c => c.code === code);

  // =======================
  // SCHOLARSHIPS
  // =======================
  await prisma.scholarship.createMany({
    data: [
      {
        name: "CHED Scholarship",
        description: "A scholarship program for qualified students pursuing higher education degrees in priority courses.",
        covered_programs: "MS Computer Science, MS Information Technology, MS Engineering, PhD Data Science",
        application_instructions: "1. Submit online application form\n2. Provide certified true copy of grades\n3. Submit recommendation letters from 2 professors\n4. Pass the qualifying examination\n5. Attend interview",
        application_url: "https://ched.gov.ph/scholarships/csp/apply",
        recommendation_url: "https://ched.gov.ph/scholarships/csp/recommendation-form",
        contact_info: "ched.scholarships@ched.gov.ph | (02) 123-4567",
        admin_id: admin.admin_id
      },
      {
        name: "DOST-SEI Scholarship Program",
        description: "A scholarship for talented Filipino students who want to pursue degrees in Science, Technology, Engineering, and Mathematics (STEM).",
        covered_programs: "MS Computer Science, MS Mathematics, MS Physics, MS Engineering, PhD Data Science",
        application_instructions: "1. Register online at DOST-SEI portal\n2. Submit academic records and birth certificate\n3. Take the DOST-SEI examination\n4. Pass the interview for qualifying applicants\n5. Submit medical certificate",
        application_url: "https://www.scholarships.dost.gov.ph/apply",
        recommendation_url: "https://www.scholarships.dost.gov.ph/recommendation",
        contact_info: "dost.sei@dost.gov.ph | (02) 888-1234",
        admin_id: admin.admin_id
      },
      {
        name: "Aboitiz Foundation Scholarship Program",
        description: "A scholarship program for deserving students who demonstrate academic excellence, leadership potential, and commitment to community development.",
        covered_programs: "MS Computer Science, MS Business Administration, MS Engineering, MS Data Science, MS Environmental Management",
        application_instructions: "1. Complete online application form\n2. Submit latest transcript of records (minimum GPA of 2.0)\n3. Provide recommendation letters from 2 professors or employers\n4. Submit a personal essay (500 words) on leadership and community service\n5. Pass the panel interview",
        application_url: "https://aboitizfoundation.com/scholarships/apply",
        recommendation_url: "https://aboitizfoundation.com/scholarships/recommendation-form",
        contact_info: "scholarships@aboitizfoundation.com | (032) 123-7890",
        admin_id: admin.admin_id
      }      
    ]
  });

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
  // STUDY PLAN
  // =======================
  const studyPlan = await prisma.studyPlan.create({
    data: {
      years: 2,
      program_id: program.program_id
    }
  });

  // =======================
  // PROGRAM COURSES
  // =======================
  await prisma.programCourse.createMany({
    data: [
      { program_id: program.program_id, study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 127").course_id, year: 1, semester: 1, is_placed: true },
      { program_id: program.program_id, study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 128").course_id, year: 1, semester: 1, is_placed: true },
      { program_id: program.program_id, study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 131").course_id, year: 1, semester: 1, is_placed: true },

      { program_id: program.program_id, study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 132").course_id, year: 1, semester: 2, is_placed: true },
      { program_id: program.program_id, study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 135").course_id, year: 1, semester: 2, is_placed: true },

      { program_id: program.program_id, study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 198").course_id, year: 2, semester: 1, is_placed: true },
      { program_id: program.program_id, study_plan_id: studyPlan.study_plan_id, course_id: getCourse("CMSC 200").course_id, year: 2, semester: 2, is_placed: true },
    ]
  });
  // ==================
  // testimony
  // ==================
  await prisma.testimony.createMany({
    data: [
      {
        alumnus_name: "Maria Santos",
        testimony_description: "The program helped me build a strong foundation in research and opened doors to international opportunities.",
        alumnus_graduate_program: "MS Computer Science"
      },
      {
        alumnus_name: "Juan Dela Cruz",
        testimony_description: "Excellent faculty and hands-on experience. I was able to land a job right after graduation.",
        alumnus_graduate_program: "MS Information Technology"
      },
      {
        alumnus_name: "Angela Reyes",
        testimony_description: "The curriculum was challenging but rewarding. It really prepared me for real-world problems.",
        alumnus_graduate_program: "PhD Data Science"
      },
      {
        alumnus_name: "Mark Villanueva",
        testimony_description: "I gained both technical and soft skills that helped me grow professionally.",
        alumnus_graduate_program: "MS Software Engineering"
      },
      {
        alumnus_name: "Liza Fernandez",
        testimony_description: "Great community and support system. The experience was truly life-changing.",
        alumnus_graduate_program: "MS Information Systems"
      }
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
