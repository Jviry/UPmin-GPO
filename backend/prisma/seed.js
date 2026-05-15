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
      logo: '/seed-assets/office/default-logo.png',
      mission: 'Provide high-quality graduate education.',
      vision: 'Center of excellence in research.',
      core_values: 'Integrity, Excellence, Innovation',
      history: 'Graduate office history...',
      phone: '123-4567',
      email: 'grad@university.edu',
      org_chart_url: '/seed-assets/office/GPO-Organizational-Chart.png',

      featuredPhotos: {
        create: [
          { url: '/seed-assets/office/photo1.jpg' },
          { url: '/seed-assets/office/photo2.jpg' }
        ]
      }
    }
  });


  // =======================
  // COURSES
  // =======================
  await prisma.course.createMany({
    data: [
      // Elective Courses (Based on MM Prospectus)
      { name: "Agribusiness Systems", code: "ABM 230", type: "pool", units: 3 },
      { name: "Special Topics in Agribusiness Management", code: "ABM 234", type: "pool", units: 3 },
      { name: "Development Perspectives", code: "DM 231", type: "pool", units: 3 },
      { name: "Community Management", code: "DM 232", type: "pool", units: 3 },
      { name: "Local Governance", code: "DM 233", type: "pool", units: 3 },
      { name: "Labor and Economy", code: "IR 204", type: "pool", units: 3 },
      { name: "Collective Bargaining and Industrial Democracy", code: "IR 211", type: "pool", units: 3 },
      { name: "Deterministic and Probabilistic Models of Choice", code: "M201", type: "pool", units: 3 },
      { name: "Management Communication and Information", code: "M205", type: "pool", units: 3 },
      { name: "Special Topics in Management", code: "M234", type: "pool", units: 3 },
      { name: "Managing an Environmentally & Economically Sustainable Enterprise", code: "M235", type: "pool", units: 3 },

      // Diploma in Urban and Regional Planning Courses 
      { name: "Theory and Practice of Planning", code: "P201", type: "core", units: 3 },
      { name: "Land Use Planning", code: "P203", type: "core", units: 3 },
      { name: "Project Planning and Development", code: "P205", type: "core", units: 3 },
      { name: "Planning Process", code: "P210", type: "core", units: 3 },
      { name: "Planning Workshop", code: "P210.1", type: "core", units: 5 },
      { name: "Planning Analysis and Techniques", code: "P214", type: "core", units: 3 },
      { name: "Site Planning", code: "P231", type: "core", units: 3 },
      { name: "Research Methods in Planning", code: "P299", type: "core", units: 3 },

      // Additional Courses for Master of Arts in Urban and Regional Planning
      { name: "Special Problems in Regional Planning", code: "P229", type: "pool", units: 3 },
      { name: "MASTER'S THESIS", code: "P300", type: "pool", units: 6 },

      // Diploma in Exercise and Sports Science Courses
      // Course Codes are tentative and subject to change, provided info by GPO does NOT contain them
      { name: "Human Anatomy & Physiology", code: "PE001", type: "core", units: 3 },
      { name: "Philosophy of Sports & Physical Education", code: "PE002", type: "core", units: 3 },
      { name: "Principles of Coaching", code: "PE003", type: "core", units: 3 },
      { name: "Administration & Supervision of Physical Education", code: "PE004", type: "core", units: 3 },
      { name: "First Aid", code: "PE005", type: "core", units: 3 },
      { name: "Tests & Measurements in Human Movement", code: "PE006", type: "core", units: 3 },
      { name: "Management of Sports and Recreation Related Services Exercise Physiology", code: "PE007", type: "core", units: 3 },
      { name: "Acquisition of Motor Skills", code: "PE008", type: "core", units: 3 },
      { name: "Internship", code: "PE009", type: "core", units: 3 },
      { name: "Philippine Games", code: "PE010", type: "core", units: 3 },
      { name: "Psychology in Sports", code: "PE011", type: "core", units: 3 },


      // Additional Courses for Master of Science in Human Movement Science
      // Course Codes are tentative and subject to change, provided info by GPO does NOT contain them
      { name: "Philosophy of Human Movement Science", code: "PE012", type: "core", units: 3 },
      { name: "Research in Human Movement Science", code: "PE013", type: "core", units: 3 },
      { name: "Measurement and Evaluation in Human Movement Science", code: "PE014", type: "core", units: 3 },
      
      // AREAS OF SPECIALIZATION
      // 1. Exercise Science
      { name: "Sports Psychology", code: "PE015", type: "core", units: 3 },
      { name: "Motor Control", code: "PE016", type: "core", units: 3 }, // Also in Physical Education
      { name: "Analysis of Human Movement", code: "PE017", type: "core", units: 3 },
      { name: "Applied Exercise Physiology", code: "PE018", type: "core", units: 3 },

      // 2. Physical Education
      { name: "Advanced Administration of Physical Education", code: "PE019", type: "core", units: 3 },
      { name: "Current Trends in Physical Education", code: "PE020", type: "core", units: 3 },
      { name: "Psycho-social Issues in Physical Education", code: "PE021", type: "core", units: 3 },

      // 3. Leisure Studies
      { name: "Management of Leisure", code: "PE022", type: "core", units: 3 },
      { name: "Leisure for Special Groups", code: "PE023", type: "core", units: 3 },
      { name: "Contemporary Issues in Leisure", code: "PE024", type: "core", units: 3 },
      { name: "Leisure in Education", code: "PE025", type: "core", units: 3 },


      // Master in Biology Courses
      // Core Courses
      { name: "Chemical Physiology", code: "BIO 220", type: "core", units: 3 },
      { name: "Advanced Genetics", code: "BIO 240", type: "core", units: 3 },
      { name: "Differentiation in Embryonic Systems", code: "BIO 230", type: "core", units: 3 },
      { name: "Advanced Cell and Molecular Biology", code: "BIO 250", type: "core", units: 3 },
      { name: "Advanced Ecology", code: "BIO 260", type: "core", units: 3 },

      // Required Courses
      { name: "Seminar", code: "BIO 296", type: "core", units: 1 },
      { name: "Research in Biology", code: "BIO 299", type: "core", units: 2 },
      { name: "Thesis", code: "BIO 300", type: "core", units: 6 },

      // Specialty Tracks 
      // Course Codes are tentative and subject to change, provided info by GPO does NOT contain them
      { name: "Cell and Molecular Biology", code: "BIO 301", type: "pool", units: 3 },
      { name: "Ecology and Taxonomy", code: "BIO 302", type: "pool", units: 3 },

      // Master in Food Science Courses
      // Core Courses
      { name: "Food Analysis", code: "FST 202", type: "core", units: 3 },
      { name: "Food Biochemistry", code: "FST 210", type: "core", units: 3 },
      { name: "Advanced Food Microbiology", code: "FST 221", type: "core", units: 3 },
      { name: "Thermal Processing", code: "FST 235", type: "core", units: 3 },
      { name: "Graduate Seminar", code: "FST 299", type: "core", units: 3 },
      { name: "Master's Thesis", code: "FST 300", type: "core", units: 4 },

      // Other Major Courses
      { name: "Postharvest Biochemistry of Fruits & Vegetables", code: "FST 219", type: "pool", units: 3 },
      { name: "Microbiological Aspects of Food Processing", code: "FST 220", type: "pool", units: 3 },
      { name: "Dehydration and Freezing", code: "FST 236", type: "pool", units: 3 },
      { name: "Tropical Food Processing", code: "FST 240", type: "pool", units: 3 },
      { name: "Tropical Fruits & Vegetables Processing", code: "FST 241", type: "pool", units: 3 },
      { name: "Processing of Protein-Rich Foods", code: "FST 242", type: "pool", units: 3 },
      { name: "Special Problems", code: "FST 290", type: "pool", units: 3 },
      { name: "Special Topics", code: "FST 291", type: "pool", units: 3 },

      // Master in Management Courses
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
      { name: "Agribusiness Management and Entreprenuership", code: "ABME 399", type: "pool", units: 1 },
      { name: "Agricultural and Applied Economics", code: "AECO 399", type: "pool", units: 2 },
      { name: "Economics", code: "ECON 399", type: "pool", units: 2 },

      { name: "Agribusiness Management and Entreprenuership", code: "ABME 400", type: "pool", units: 1 },
      { name: "Agricultural and Applied Economics", code: "AECO 400", type: "pool", units: 2 },
      { name: "Economics", code: "ECON 400", type: "pool", units: 2 },
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

  // Master of Science in Food Science Course Pools
  await prisma.coursePool.create({
    data: {
      name: "Major Electives",
      program_id: msfsProgram.program_id,
      entries: {
        create: [
          { course_id: getCourse("FST 219").course_id },
          { course_id: getCourse("FST 220").course_id },
          { course_id: getCourse("FST 236").course_id },
          { course_id: getCourse("FST 240").course_id },
          { course_id: getCourse("FST 241").course_id },
          { course_id: getCourse("FST 242").course_id },
          { course_id: getCourse("FST 290").course_id },
          { course_id: getCourse("FST 291").course_id },
        ]
      }
    }, 
  });

  // Master of Science in Biology Course Pools
  await prisma.coursePool.create({
    data: {
      name: "Specialty Electives",
      program_id: msbProgram.program_id,
      entries: {
        create: [
          { course_id: getCourse("BIO 301").course_id },
          { course_id: getCourse("BIO 302").course_id },
        ]
      }
    }, 
  });

  await prisma.coursePool.create({
    data: {
      name: "Major Electives",
      program_id: maurpProgram.program_id,
      entries: {
        create: [
          { course_id: getCourse("P229").course_id },
          { course_id: getCourse("P300").course_id },
        ]
      }
    }, 
  });

  await prisma.coursePool.create({
    data: {
      name: "Graduate Seminar Courses",
      program_id: phdByResearchProgram.program_id,
      entries: {
        create: [
          { course_id: getCourse("ABME 399").course_id },
          { course_id: getCourse("AECO 399").course_id },
          { course_id: getCourse("ECON 399").course_id },
        ]
      }
    }, 
  });  

  await prisma.coursePool.create({
    data: {
      name: "Doctoral Courses",
      program_id: phdByResearchProgram.program_id,
      entries: {
        create: [
          { course_id: getCourse("ABME 400").course_id },
          { course_id: getCourse("AECO 400").course_id },
          { course_id: getCourse("ECON 400").course_id },
        ]
      }
    }, 
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

      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M241").course_id, year: 2, semester: 2 },
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: null, year: 2, semester: 2, is_elective_slot: true },
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: null, year: 2, semester: 2, is_elective_slot: true },

      // PhD by Research Study Plan 1 (4 years)
      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 1, semester: 1, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 1, semester: 2, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 2, semester: 1, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 2, semester: 2, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 3, semester: 1, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 3, semester: 2, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 4, semester: 1, is_elective_slot: true },
      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 4, semester: 1, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 4, semester: 2, is_elective_slot: true },

      // PhD by Research Study Plan 2 (3 years)
      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 1, semester: 1, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 1, semester: 2, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 2, semester: 1, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 2, semester: 2, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 3, semester: 1, is_elective_slot: true },
      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 3, semester: 1, is_elective_slot: true },

      { study_plan_id: phdByResearchProgram.study_plan_id, course_id: null, year: 3, semester: 2, is_elective_slot: true },   
      
      // Master of Science in Biology Study Plan
      { study_plan_id: msbStudyPlan.study_plan_id, course_id: getCourse("BIO 220").course_id, year: 1, semester: 1 },
      { study_plan_id: msbStudyPlan.study_plan_id, course_id: getCourse("BIO 240").course_id, year: 1, semester: 1 },
      { study_plan_id: msbStudyPlan.study_plan_id, course_id: getCourse("BIO 230").course_id, year: 1, semester: 1 },

      { study_plan_id: msbStudyPlan.study_plan_id, course_id: getCourse("BIO 260").course_id, year: 1, semester: 2 },
      { study_plan_id: msbStudyPlan.study_plan_id, course_id: getCourse("BIO 250").course_id, year: 1, semester: 2 },
      { study_plan_id: msbStudyPlan.study_plan_id, course_id: null, year: 1, semester: 2, is_elective_slot: true },

      { study_plan_id: msbStudyPlan.study_plan_id, course_id: null, year: 2, semester: 1, is_elective_slot: true },
      { study_plan_id: msbStudyPlan.study_plan_id, course_id: null, year: 2, semester: 1, is_elective_slot: true },
      { study_plan_id: msbStudyPlan.study_plan_id, course_id: getCourse("BIO 296").course_id, year: 2, semester: 1 },
      { study_plan_id: msbStudyPlan.study_plan_id, course_id: getCourse("BIO 299").course_id, year: 2, semester: 1 },

      { study_plan_id: msbStudyPlan.study_plan_id, course_id: getCourse("BIO 300").course_id, year: 2, semester: 2 },
    ],
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
