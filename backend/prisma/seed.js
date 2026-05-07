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
  // COURSES
  // =======================
  await prisma.course.createMany({
    data: [
      // Elective Courses
      { name: "Agribusiness Systems", code: "ABM 230", type: "elective", units: 3 },
      { name: "Special Topics in Agribusiness Management", code: "ABM 234", type: "elective", units: 3 },
      { name: "Development Perspectives", code: "DM 231", type: "elective", units: 3 },
      { name: "Community Management", code: "DM 232", type: "elective", units: 3 },
      { name: "Local Governance", code: "DM 233", type: "elective", units: 3 },
      { name: "Labor and Economy", code: "IR 204", type: "elective", units: 3 },
      { name: "Collective Bargaining and Industrial Democracy", code: "IR 211", type: "elective", units: 3 },
      { name: "Deterministic and Probabilistic Models of Choice", code: "M201", type: "elective", units: 3 },
      { name: "Management Communication and Information", code: "M205", type: "elective", units: 3 },
      { name: "Special Topics in Management", code: "M234", type: "elective", units: 3 },
      { name: "Managing an Environmentally & Economically Sustainable Enterprise", code: "M235", type: "elective", units: 3 },

      // Master in Management Core Courses
      { name: "Organizational Analysis", code: "M206", type: "core", units: 3 },
      { name: "Systems Approach to Strategic Planning", code: "M209", type: "core", units: 3 },
      { name: "Mixed Methods Approach for Business and Management Research", code: "M210", type: "core", units: 3 },
      { name: "Marketing Management", code: "M211", type: "core", units: 3 },
      { name: "Financial Management", code: "M212", type: "core", units: 3 },
      { name: "Human Resource Management and Industrial Relations System", code: "M216", type: "core", units: 3 },

      { name: "Operations and Production Management", code: "M217", type: "core", units: 3 },
      { name: "Management Accounting and Control", code: "MGT213", type: "core", units: 3 },
      { name: "Managerial Economics", code: "M224", type: "core", units: 3 },
      { name: "Policy and Strategic Planning", code: "M241", type: "core", units: 4 },

      // PhD by Research Core Courses
      { name: "Agribusiness Management and Entreprenuership", code: "ABME 399", type: "core", units: 1 },
      { name: "Agricultural and Applied Economics", code: "AECO 399", type: "core", units: 2 },
      { name: "Economics", code: "ECON 399", type: "core", units: 2 },

      { name: "Agribusiness Management and Entreprenuership", code: "ABME 400", type: "core", units: 1 },
      { name: "Agricultural and Applied Economics", code: "AECO 400", type: "core", units: 2 },
      { name: "Economics", code: "ECON 400", type: "core", units: 2 },
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

  const dessProgram = await prisma.program.create({
    data: {
      type: "Post Baccalaureate Program",
      name: "Diploma in Exercise and Sports Science",
      description: "The Diploma in Exercise and Sports Science (DESS) at UP Mindanao is a two-year, 39-unit post-baccalaureate program designed for professionals and non-related degree holders aiming to specialize in sports, fitness, and Physical Education. It bridges the gap for educators and practitioners, offering a formal academic foundation in human movement.",
      history: "The Diploma in Exercise and Sports Science (DESS) program at UP Mindanao was established in school year 2017-2018.",

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

  const durpProgram = await prisma.program.create({
    data: {
      type: "Post Baccalaureate Program",
      name: "Diploma in Urban and Regional Planning",
      description: "The Diploma in Urban and Regional Planning (DURP) at UP Mindanao is a 26-unit postgraduate program designed to equip practitioners with the knowledge, skills, and attitude required for comprehensive development planning. It caters to planners, particularly in local government, to address growing urban development challenges.",
      history: "The Diploma in Urban and Regional Planning (DURP) along with the Master in Urban and Regional Planning (MAURP) program at the University of the Philippines Mindanao was reoffered in the Second Semester of Academic Year 2016-2017. The program was revived under the Department of Architecture following approval by the UP Mindanao University Council in November 2016.",

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

  const maurpProgram = await prisma.program.create({
    data: {
      type: "Graduate Program",
      name: "Master in Urban and Regional Planning",
      description: "The Master of Arts in Urban and Regional Planning at UP Mindanao is a ladderized graduate program designed to develop leadership, management, and research skills for planning professionals, specifically addressing the growing demands of urbanization and development in the Mindanao region.",
      history: "The Master in Urban and Regional Planning (MAURP) program at the University of the Philippines Mindanao was originally offered by the School of Management (SOM) before being revived under the Department of Architecture on November 2016.",

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

  const mshmsProgram = await prisma.program.create({
    data: {
      type: "Graduate Program",
      name: "Master of Science in Human Movement Science",
      description: "The Master of Science in Human Movement Science (MSHMS) at UP Mindanao is a 39-unit graduate program designed for advanced professional training in exercise science, physical education, and leisure studies. It focuses on scientific, research-oriented study to equip practitioners with skills in critical inquiry for careers in education, sports, and health.",
      history: "The Master of Science in Human Movement Science (MSHMS) program was approved for adoption by the University of the Philippines Mindanao Board of Regents on April 3, 2023, with the program formally commencing in the 2023-2024 academic year.",

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

  const msfsProgram = await prisma.program.create({
    data: {
      type: "Graduate Program",
      name: "Master of Science in Food Science",
      description: "The Master of Science in Food Science (MSFS) program at the University of the Philippines Mindanao is a graduate-level program under the Department of Food Science and Chemistry, designed to produce specialists in food safety, security, and innovation. It trains professionals to address food industry challenges in Mindanao, focusing on chemical, physical, and microbiological aspects of food processing.",
      history: "The Master of Science in Food Science program at the University of the Philippines Mindanao was established as part of the institution’s graduate offerings, with the university itself founded on February 20, 1995. The program was developed to address the growing need for food science expertise in the Mindanao region, particularly in response to the challenges faced by the local food industry. It has since become a key component of UP Mindanao’s commitment to providing high-quality graduate education and contributing to regional development through research and innovation in food science.",

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

  const mmProgram = await prisma.program.create({
    data: {
      type: "Graduate Program",
      name: "Master in Management",
      description: "The Master in Management (MM) program is designed to hone professionals in managerial and supervisory positions by providing them with key management science tools, strategic management concepts, and organization-relevant approaches.\n The program initially provides our students with several analytical and quantitative courses taught through case studies, team projects, and lectures before giving them the opportunity to apply this knowledge to real-world cases in Mindanao. To graduate, students are required to draw on the sum of their theoretical knowledge and practical experience to develop a strategic plan for their chosen organization.",
      history: "Program history...",

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

  const phdByResearchProgram = await prisma.program.create({
    data: {
      type: "Doctor of Philosophy Program (PhD)",
      name: "PhD by Research",
      description: "The PhD by Research program aims to produce graduates who have contributed to the body of knowledge in specific fields of study or to have provided innovative, theory-based, systematic, and practical solutions to the significant concerns of specific industries. Graduates will have advanced systematic knowledge and skills applied in a highly specialized or complex multidisciplinary field of professional work, research, and/or further study that require management expertise, innovation, and leadership. Graduates will demonstrate an in-depth understanding of theories and concepts necessary to advance learning and/or professional practice as well as to practice research skills providing a critical perspective of the real-world complex issues related to a specific field of study.\n The PhD by Research program aims to hone further the research skill of the candidate, acquired mostly through experience under the professional guidance of specialist(s) in his/her particular area of specialization. The program allows the candidate to earn the degree through submission, and the successful defense of a dissertation, without the usual academic course requirements. The program requires the candidate to devote almost his/her entire residency to research.",
      history: "The PhD by Research program in the University of the Philippines Mindanao School of Management was established to provide advanced research training, with the campus itself having been created on February 20, 1995. While the campus is a relatively young constituent university, its focus on graduate studies and research has matured over its 31-year history.",
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
  // FACULTY + CREDENTIALS
  // =======================
  await prisma.faculty.createMany({
    data: [
      { name: "Dr. Maria Santos", email: "maria@univ.edu", photo: "photo1.jpg", position: "Program Coordinator" },
      { name: "Prof. Juan Dela Cruz", email: "juan@univ.edu", photo: "photo2.jpg", position: "Lecturer" },
      { name: "Dr. Ana Reyes", email: "ana@univ.edu", photo: "photo3.jpg", position: "Lecturer" },
      { name: "Prof. Carlos Tan", email: "carlos@univ.edu", photo: null, position: "Lecturer" },
      { name: "Dr. Jose Rizal", email: "jose@univ.edu", photo: "photo5.jpg", position: "Program Coordinator" },
    ]
  });

  const faculties = await prisma.faculty.findMany();
  const getFactulty = (email) => faculties.find(f => f.email === email);

  await prisma.facultyCredential.createMany({
    data: [
      { degree: "BS Computer Science", faculty_id: getFactulty("maria@univ.edu").faculty_id },
      { degree: "MS Computer Science", faculty_id: getFactulty("maria@univ.edu").faculty_id },
      { degree: "PhD Computer Science", faculty_id: getFactulty("maria@univ.edu").faculty_id },
      { degree: "BS Information Technology", faculty_id: getFactulty("juan@univ.edu").faculty_id },
      { degree: "MS Information Technology", faculty_id: getFactulty("juan@univ.edu").faculty_id },
      { degree: "BS Mathematics", faculty_id: getFactulty("ana@univ.edu").faculty_id },
      { degree: "MS Mathematics", faculty_id: getFactulty("ana@univ.edu").faculty_id },
      { degree: "PhD Mathematics", faculty_id: getFactulty("ana@univ.edu").faculty_id },
      { degree: "BS Computer Engineering", faculty_id: getFactulty("carlos@univ.edu").faculty_id },
      { degree: "MS Computer Engineering", faculty_id: getFactulty("carlos@univ.edu").faculty_id },
      { degree: "BS Agriculture", faculty_id: getFactulty("jose@univ.edu").faculty_id },
      { degree: "MS Agriculture", faculty_id: getFactulty("jose@univ.edu").faculty_id },
      { degree: "PhD Agriculture", faculty_id: getFactulty("jose@univ.edu").faculty_id },
    ]
  });

  // =======================
  // PROGRAM FACULTY
  // =======================
  await prisma.programFaculty.createMany({
    data: [
      { program_id: program.program_id, faculty_id: getFactulty("maria@univ.edu").faculty_id },
      { program_id: program.program_id, faculty_id: getFactulty("juan@univ.edu").faculty_id },
      { program_id: program.program_id, faculty_id: getFactulty("ana@univ.edu").faculty_id },
      { program_id: program.program_id, faculty_id: getFactulty("carlos@univ.edu").faculty_id },
      { program_id: program.program_id, faculty_id: getFactulty("jose@univ.edu").faculty_id },
    ]
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
