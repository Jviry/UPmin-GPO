import { prisma } from '../db/db.js';
async function main() {
  await prisma.office.create({
    data: {
      name: 'Graduate Studies Office',
      logo: '/public/seed-assets/office/default-logo.png',
      objectives: 'Excellence in graduate education',
      history: 'Established to oversee all graduate programs and academic standards.',
      location: 'Admin Building',
      contact_info: '123-4567',
      email: 'grad@university.edu',

      featuredPhotos: {
        create: [
          {
            url: '/public/seed-assets/office/photo1.jpg',
          },
          {
            url: '/public/seed-assets/office/photo2.jpg',
          }
        ]
      }
    }
  });
  await prisma.college.createMany({
    data: [
      {
        name: "College of Science and Mathematics (CSM)",
        dean: "Dr. Maria Santos",
        contact_info: "csm@university.edu | +63 912 345 6789",
      },
      {
        name: "College of Humanities and Social Sciences (CHSS)",
        dean: "Dr. Juan Dela Cruz",
        contact_info: "chss@university.edu | +63 917 123 4567",
      },
      {
        name: "School of Management (SOM)",
        dean: "Dr. Ana Reyes",
        contact_info: "som@university.edu | +63 905 678 1234",
      },
      {
        name: "College of Engineering",
        dean: "Dr. Carlo Mendoza",
        contact_info: "engineering@university.edu | +63 918 222 3333",
      },
    ],
  });
  // 1. Create Courses
  await prisma.course.createMany({
    data: [
      { name: "Data Structures", code: "CMSC 127", description: "Basic data structures", type: "Core", units: 3 },
      { name: "Algorithms", code: "CMSC 128", description: "Algorithm design", type: "Core", units: 3 },
      { name: "Database Systems", code: "CMSC 131", description: "Relational databases", type: "Core", units: 3 },
      { name: "Operating Systems", code: "CMSC 132", description: "OS principles", type: "Core", units: 3 },
      { name: "Software Engineering", code: "CMSC 198", description: "Software dev lifecycle", type: "Core", units: 3 },
      { name: "Machine Learning", code: "CMSC 180", description: "Intro to ML", type: "Elective", units: 3 },
      { name: "Computer Networks", code: "CMSC 135", description: "Networking basics", type: "Core", units: 3 },
      { name: "Thesis", code: "CMSC 200", description: "Graduate thesis", type: "Capstone", units: 6 },
    ],
  });

  // 2. Fetch created courses (needed for relations)
  const allCourses = await prisma.course.findMany();

  const getCourse = (code) =>
    allCourses.find(c => c.code === code);

  // 3. Create Graduate Program
  const program = await prisma.graduateProgram.create({
    data: {
      name: "MS Computer Science",
      description: "Advanced study in computer science.",
      years: 2,
      history: "Established to advance computing research.",
      qualifications: "BS Computer Science or related field.",
      application_process: "Submit documents and pass evaluation.",
      application_url: "https://example.com/apply",
      college_id: 1, // make sure this exists
    },
  });

  // 4. Create Study Plan (ProgramCourses)
  await prisma.programCourse.createMany({
    data: [
      // YEAR 1 - SEM 1
      { program_id: program.program_id, course_id: getCourse("CMSC 127").course_id, year: 1, semester: 1 },
      { program_id: program.program_id, course_id: getCourse("CMSC 128").course_id, year: 1, semester: 1 },
      { program_id: program.program_id, course_id: getCourse("CMSC 131").course_id, year: 1, semester: 1 },

      // YEAR 1 - SEM 2
      { program_id: program.program_id, course_id: getCourse("CMSC 132").course_id, year: 1, semester: 2 },
      { program_id: program.program_id, course_id: getCourse("CMSC 135").course_id, year: 1, semester: 2 },
      { program_id: program.program_id, course_id: getCourse("CMSC 180").course_id, year: 1, semester: 2 },

      // YEAR 2 - SEM 1
      { program_id: program.program_id, course_id: getCourse("CMSC 198").course_id, year: 2, semester: 1 },

      // YEAR 2 - SEM 2
      { program_id: program.program_id, course_id: getCourse("CMSC 200").course_id, year: 2, semester: 2 },
    ],
  });

  // 5. Downloadable Resources
  await prisma.downloadableResource.createMany({
    data: [
      {
        title: "Curriculum Guide",
        category: "Curriculum",
        file_url: "https://example.com/curriculum.pdf",
        program_id: program.program_id,
      },
      {
        title: "Application Form",
        category: "Forms",
        file_url: "https://example.com/form.pdf",
        program_id: program.program_id,
      },
    ],
  });

  await prisma.admin.create({
    data: {
      email: "superadmin@gmail.com",
      name: "Super Admin",
      password: "$2a$10$n/eU5FSZBdSC/K5HHv/HTuiGStK6CPSVmP1JXhmDOGuVZvlt7Rivq", //123
      role: "superadmin",

      announcements: {
        create: [
          {
            title: "Welcome to Graduate Studies",
            content_description: "We are excited to welcome all new graduate students this semester."
          },
          {
            title: "Application Deadline Extended",
            content_description: "The deadline for graduate applications has been extended by two weeks."
          },
          {
            title: "New Programs Available",
            content_description: "We are launching new graduate programs this academic year."
          }
        ]
      }
    }
  });

  console.log('Seed data inserted!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
