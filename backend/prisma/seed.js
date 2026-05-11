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

  const dessProgram = await prisma.program.create({
    data: {
      type: "Post Baccalaureate Program",
      name: "Diploma in Exercise and Sports Science",
      description: "The Diploma in Exercise and Sports Science (DESS) at UP Mindanao is a two-year, 39-unit post-baccalaureate program designed for professionals and non-related degree holders aiming to specialize in sports, fitness, and Physical Education. It bridges the gap for educators and practitioners, offering a formal academic foundation in human movement.",
      history: "The Diploma in Exercise and Sports Science (DESS) program at UP Mindanao was established in school year 2017-2018.",

      program_application: {
        create: {
          qualifications: "Must be a Bachelor's Degree holder",
          application_instructions: "TBA",
          application_requirements: "Completed Application Form with a recent 2x2 pic (white background); PSA Birth Certificate, if single; OR Marriage Certificate, if married (for female only); Official Transcript of Records (OTR); Recommendation letter from two (2) superiors and/or former professors. ",
          application_url: "http://bit.ly/dess-forms",
          recommendation_url: "TBA",
          fees_url: "TBA",
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
      description: "The Diploma in Urban and Regional Planning (DURP) is offered by UP in Mindanao to enable professional planners to respond more effectively to the steadyily increasing demands of development. This program will equip urban an regional planners with knowledge and skills to carry out the national policy of the comprehensive planning and devlopment.",
      history: "The Diploma in Urban and Regional Planning (DURP) along with the Master in Urban and Regional Planning (MAURP) program at the University of the Philippines Mindanao was reoffered in the Second Semester of Academic Year 2016-2017. The program was revived under the Department of Architecture following approval by the UP Mindanao University Council in November 2016.",

      program_application: {
        create: {
          qualifications: "A bachelor's degree from a recognized institution of higher learning; A minimum weighted average grade of 2.5 or its equivalent; Relevant work experience of at least two years.",
          application_instructions: "Interested applicants may fill out the form and submit the requirements via the application URL below. The reference forms are to be duly accomplished by at least 2 references and sent directly to architecture.upmin@up.edu.ph.",
          application_requirements: "A favorable letter of recommendation from a former superior and at least one other person who is well acquainted with, but not related to the applicant; Passing the Graduate Admission Test; Favorable assessment of interview results.",
          application_url: "http://bit.ly/UPMindanaoDURP2023",
          recommendation_url: "TBA",
          fees_url: "TBA",
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
      name: "Master of Arts in Urban and Regional Planning",
      description: "The Master of Arts in Urban and Regional Planning at UP Mindanao is a ladderized graduate program designed to develop leadership, management, and research skills for planning professionals, specifically addressing the growing demands of urbanization and development in the Mindanao region.",
      history: "The Master in Urban and Regional Planning (MAURP) program at the University of the Philippines Mindanao was originally offered by the School of Management (SOM) before being revived under the Department of Architecture on November 2016.",

      program_application: {
        create: {
          qualifications: "To qualify for the Master's Program (MAURP), a student must have a weighted average of 1.75 or better in his/her Diploma Program and upon he recommendation of the Program Adviser and approval of the Dean.",
          application_instructions: "Interested applicants may fill out the form and submit the requirements via the application URL below. The reference forms are to be duly accomplished by at least 2 references and sent directly to architecture.upmin@up.edu.ph.",
          application_requirements: "TBA",
          application_url: "TBA",
          recommendation_url: "TBA",
          fees_url: "TBA",
        }
      }
    },
    include: {
      program_application: true
    }
  });

  const msbProgram = await prisma.program.create({
    data: {
      type: "Graduate Program",
      name: "Master of Science in Biology",
      description: "The Master of Science in Biology is a two-year graduate program with 33 units. The program is an adoption of the MS Biology program from UP Diliman. Students may specialize in (i) Cell and Molecular Biology or (ii) Ecology and Taxonomy. Both specializations use a systematic and integrative approach to conceptual learning. They focus on developing critical inquiry among the students and cultivating the body of knowledge in the discipline, both in the context of nation-building.",
      history: "The Master of Science in Human Movement Science (MSHMS) program was approved for adoption by the University of the Philippines Mindanao Board of Regents on April 3, 2023, with the program formally commencing in the 2023-2024 academic year.",

      program_application: {
        create: {
          qualifications: "TBA",
          application_instructions: "TBA",
          application_requirements: "Applicants of the MS Biology program must be holders of a bachelor's degree in biology or related fields subject to evaluation of the Graduate Committee of the Department; A general weighted average (GWA) of at least 2.0; An applicant with a GWA between 2.01 and 2.75 may be admitted to the program on probation until and provided that the student will obtain an average grade of at least 2.0 in the first 9 units of graduate courses he/she enrolls in; The Graduate Committee may recommend additional requirement as needed; Must have taken Bio 133 (Developmental Biology) or equivalent/COI; Proof of English proficiency for students whose native language is not English or Filipino, except those who graduated from institutions where the medium of instruction is English or Filipino; Completed application form, official transcript of records, two (2) written recommendations from former professors or experts in the field, prescribed application fee, and other required documents submitted to the Graduate Committee; Taking of the graduate placement exam (GPE) and interview – Applicants must pass at least three of five areas (Cell and Molecular Biology, Developmental Biology, Ecology and Taxonomy, Genetics, and Physiology) of the GPE administered by the Graduate Committee.",
          application_url: "https://forms.gle/13TK3peosTJCHNo27",
          recommendation_url: "N/A",
          fees_url: "TBA",
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
          qualifications: "Undegraduate Degree must be the ff: Major in Physical Education, Major in Sports Science, or Allied Medical Science (Physiotherapy/Medicine); General Weighted Average of 2.25 or better (if from other universities) OR 2.5 or better (if a graduate from UP Diliman College of Human Kinetics)",
          application_instructions: "You can transact payment of your application fee and other fees via PISO NET or INTER/INTRABANK TRANSFER; Account Name: UP Mindanao, Account Number: 000-004949152, Bank: DBP; Please send your transaction reciept to cash.upmindanao@up.edu.ph and ktbalino1@up.edu.ph | Subject: MSHMS_(FAMILYNAME)-8FEE. Reciept can be in pdf or jpeg form and name file as: (FAMILYNAME)_8FEE",
          application_requirements: "Completed Application Form with a recent 2x2 pic; Official Transcript of Records (OTR); Certificate of GWA/GPA (or any equivalent); PSA Birth Certificate, if single; OR Marriage Certificate, if married (for women only); Certificate of English Language Proficiency (TOEFL, or equivalent); A preliminary research proposal; Recommendation from two (2) superiors and/or former professor; Must pass the written examination and interview; Application Fee, Filipino/Foreign Resident: Php 500.00, Foreign Non-Resident: USD 25.00.",
          application_url: "http://bit.ly/mshms-forms",
          recommendation_url: "TBA",
          fees_url: "TBA",
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
          qualifications: "Holder's of bachelor's degree in Food Science and Technology or related disciplines with a general weighted average of 2.50 or better.",
          application_instructions: "TBA",
          application_requirements: "A duly accomplished Application form (GS-Form 1) must be submitted with the following documents: Cover letter addressed to the Dean, signifying intent to apply and the degree sought; Original or Certified Copy of Official Transcript of Records; Two sealed letters of recommendation (GS-Form 2) from former professorsm, supervisors, or collegues; For foreign applicants: Certification of medium of instructions (in previous degree) by the University Registrar or results of TOEFL (min score: 600) or IELTS (min score: 6.5); Non-refundable application fee (Php 200.00 for Filipino appplicants and USD 25.00 for foreign applicants).",
          application_url: "https://apply.com",
          recommendation_url: "https://reco.com",
          fees_url: "TBA,"
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
      history: "TBA",

      program_application: {
        create: {
          qualifications: "TBA",
          application_instructions: "The school accepts application for the program from November to May of the following year. Submit the duly accomplished application forms together with (1) your official transcript of records, (2) reciept of application free (P200.00) payable at our Cash Office, and (3) reciept for the examination Fee (P250.00) payable at our office.",
          application_requirements: "A bachelor's degree in any field of study; A minimum of 2.5 or equivalent average grade; At least two years of managerial or supervisory experience; A favorable recommendation from a superior and at least one other person who is well acquainted with, but not related to the applicant; Passing the Graduate Admission Test; Favorable assessment of interview results; Attendance to the Bridging Program.",
          application_url: "TBA",
          recommendation_url: "TBA",
          fees_url: "TBA",
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
          qualifications: "TBA",
          application_instructions: "TBA",
          application_requirements: "TBA",
          application_url: "https://apply.com",
          recommendation_url: "https://reco.com",
          fees_url: "TBA",
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
      // Program Coordinators
      { name: "Jackie Lou J. Tagubase", email: "jjTagubase@up.edu.ph", photo: "photo1.jpg", position: "Associate Professor" }, // MS Food Science Coordinator
      { name: "Micah Amor P. Yares", email: "mpYares@up.edu.ph", photo: "photo2.jpg", position: "Assistant Professor" }, // MA Urban and Regional Planning Coordinator
      { name: "Mae A. Responte", email: "maResponte@up.edu.ph", photo: "photo3.jpg", position: "Assistant Professor" }, // MS Biology Coordinator
      { name: "Imee Marie A. Acopiado ", email: "iaAcopiado@up.edu.ph", photo: null, position: "Assistant Professor" }, // MM Coordinator
      { name: "Pedro A. Alviola IV", email: "paAlviolaIV@up.edu.ph", photo: "photo5.jpg", position: "Professor" }, // PhD by Research Coordinator
      { name: "Jonathan Y. Cagas", email: "jyCagas@up.edu.ph", photo: "photo5.jpg", position: "Professor" }, // MS Human Movement Science Coordinator

      // MS Food Science Faculty Members
      { name: "Juma Novie A. Alviola", email: "jaAlviola@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Kriza Faye A. Calumba", email: "kaCalumba@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Dann Marie N. Del Mundo", email: "dnDelMundo@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Jennifer P. Fronteras", email: "jpFronteras@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" },
      { name: "Erwin Oliver V. Fundador", email: "evFundador@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Noreen Grace V. Fundador", email: "nvFundador@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Joel Hassan G. Tolentino", email: "jgTolentino@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" },
      { name: "Rovi Gem E. Villame-Gayagas", email: "reVillame-Gayagas@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Marbie A. Alpos-Entero", email: "maAlpos-Entero@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Julious B. Cerna", email: "jbCerna@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },

      // MS Biology Faculty Members
      { name: "Marion John Michael A. Achondo", email: "maAchondo@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" },
      { name: "Fritzie A. Camino", email: "faCamino@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Aleyla E. De Cadiz", email: "aeDeCadiz@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Aileen Grace D. Delima", email: "adDelima@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Lief Erikson D. Gamalo", email: "ldGamalo@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Junaldo A. Mantiquilla", email: "jaMantiquilla@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" },
      { name: "Cyrose Suzie S. Millado", email: "csMillado@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Lyre Anni E. Murao", email: "leMurao@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Cleto L. Nanola", email: "clNanola@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Rose L. Catiempo", email: "rlCatiempo@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Aaron Froilan M. Raganas", email: "amRaganas@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      
      // Master in Management Faculty Members (also PhD by Research Faculty Members)
      { name: "Thaddeus R. Acuña", email: "trAcuna@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Roxanne T. Aguinaldo", email: "rtAguinaldo@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Miko Mariz C. Castro", email: "mcCastro@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Larry N. Digal", email: "lnDigal@up.edu.ph", photo: "photo5.jpg", position: "Professor" }, // MM and PhD by Research Faculty Member
      { name: "Aurelia Luzviminda V. Gomez", email: "avGomez@up.edu.ph", photo: "photo5.jpg", position: "Professor" }, // MM and PhD by Research Faculty Member
      { name: "Glory Dee A. Romo", email: "gaRomo@up.edu.ph", photo: "photo5.jpg", position: "Professor" }, // MM and PhD by Research Faculty Member
      { name: "Jon Marx P. Sarmiento", email: "jpSarmiento@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" }, // MM and PhD by Research Faculty Member
      { name: "Ligaya R. Leal", email: "lrLeal@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" }, // MM and PhD by Research Faculty Member
      { name: "Vlademir A. Shuck", email: "vaShuck@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Rodgessa A. Lopez", email: "raLopez@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Shemaiah Gail P. Placencia", email: "spPlacencia@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },

      // Diploma of Exercise and Sports Science and Master of Science in Human Movement Science Faculty Members
      { name: "Jessa C. Gubalani", email: "jcGubalani@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Ester Mace V. Villela-Go", email: "evVillela-Go@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Annaliza R. Castro", email: "arCastro@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Juvanie C. Lapesigue", email: "jcLapesigue@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Catherine Joy D. Lariosa", email: "cdLariosa@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Raisalam D. Angoy", email: "rdAngoy@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Ryce B. Jubane", email: "rbJubane@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Jezreel M. Abarca", email: "jmAbarca@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" },
      { name: "Bhen Joshua F. Acosta", email: "bfAcosta@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Ma. Stella R. Salazar", email: "mrSalazar@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" },
      { name: "Pio Gerardo R. Solon", email: "prSolon@up.edu.ph", photo: "photo5.jpg", position: "Lecturer" },
      { name: "Ritchie Ian A. Solana", email: "raSolana@up.edu.ph", photo: "photo5.jpg", position: "Lecturer" },
      { name: "Mohammad Khalil A. Guinomla", email: "maGuinomla@up.edu.ph", photo: "photo5.jpg", position: "Lecturer" },

      // Diploma of Urban and Regional Planning and Master of Arts in Urban and Regional Planning Faculty Members
      { name: "Isidoro R. Malaque III", email: "irMalaqueIII@up.edu.ph", photo: "photo5.jpg", position: "Professor" },
      { name: "Angelo Felix N. Regalado", email: "anRegalado@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Minerva C. Rosel", email: "mcRosel@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Ryan C. Songcayauon", email: "rcSongcayauon@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Micah Amor P. Yares", email: "mpYares@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Marie Danielle V. Guillen", email: "mvGuillen@up.edu.ph", photo: "photo5.jpg", position: "Associate Professor" },
      { name: "Sophremiano B. Antipolo", email: "sbAntipolo@up.edu.ph", photo: "photo5.jpg", position: "Professorial Lecturer" },
      { name: "Joseph Raymund A. Sumabal", email: "jaSumabal@up.edu.ph", photo: "photo5.jpg", position: "Sr. Lecturer" },
      { name: "Marlon C. Suelto", email: "mcSuelto@up.edu.ph", photo: "photo5.jpg", position: "Sr. Lecturer" }
    ],
    skipDuplicates: true
  });

  const faculties = await prisma.faculty.findMany();
  const getFaculty = (email) => faculties.find(f => f.email === email);

  await prisma.facultyCredential.createMany({
    data: [
      // MS Food Science Faculty Credentials
      { degree: "MS Food Science", faculty_id: getFaculty("jjTagubase@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("jaAlviola@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("kaCalumba@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("dnDelMundo@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("jpFronteras@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("evFundador@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("nvFundador@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("jgTolentino@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("reVillame-Gayagas@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("maAlpos-Entero@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("jbCerna@up.edu.ph").faculty_id },

      // MS Biology Faculty Credentials
      { degree: "MS Biology", faculty_id: getFaculty("maAchondo@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("faCamino@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("aeDeCadiz@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("adDelima@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("ldGamalo@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("jaMantiquilla@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("csMillado@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("leMurao@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("clNanola@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("maResponte@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("rlCatiempo@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("amRaganas@up.edu.ph").faculty_id },

      // Master in Management Faculty Credentials
      { degree: "Master in Management", faculty_id: getFaculty("iaAcopiado@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("trAcuna@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("rtAguinaldo@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("paAlviolaIV@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("mcCastro@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("lnDigal@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("avGomez@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("gaRomo@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("jpSarmiento@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("lrLeal@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("vaShuck@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("raLopez@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("spPlacencia@up.edu.ph").faculty_id },

      // Diploma of Exercise and Sports Science Faculty Credentials
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("jcGubalani@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("jyCagas@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("evVillela-Go@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("arCastro@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("jcLapesigue@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("cdLariosa@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("rdAngoy@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("rbJubane@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("jmAbarca@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("bfAcosta@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("mrSalazar@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("prSolon@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("raSolana@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("maGuinomla@up.edu.ph").faculty_id },

      // Master of Science in Human Movement Science Faculty Credentials (same as DESS Faculty Credentials)
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("jcGubalani@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("jyCagas@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("evVillela-Go@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("arCastro@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("jcLapesigue@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("cdLariosa@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("rdAngoy@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("rbJubane@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("jmAbarca@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("bfAcosta@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("mrSalazar@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("prSolon@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("raSolana@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("maGuinomla@up.edu.ph").faculty_id },

      // Diploma in Urban and Regional Planning
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("irMalaqueIII@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("anRegalado@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("mcRosel@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("rcSongcayauon@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("mpYares@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("mvGuillen@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("sbAntipolo@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("jaSumabal@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("mcSuelto@up.edu.ph").faculty_id },

      // Master of Arts in Urban and Regional Planning Faculty Credentials (same as DURP Faculty Credentials)
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("irMalaqueIII@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("anRegalado@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("mcRosel@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("rcSongcayauon@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("mpYares@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("mvGuillen@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("sbAntipolo@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("jaSumabal@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("mcSuelto@up.edu.ph").faculty_id },

      // PhD by Research Faculty Credentials (some are the same as MM Faculty Credentials)
      { degree: "PhD by Research", faculty_id: getFaculty("paAlviolaIV@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("lnDigal@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("avGomez@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("gaRomo@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("jpSarmiento@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("lrLeal@up.edu.ph").faculty_id },
    ]
  });

  // =======================
  // PROGRAM FACULTY
  // =======================
  await prisma.programFaculty.createMany({
    data: [
      // DESS Faculty Members
      { program_id: dessProgram.program_id, faculty_id: getFaculty("jcGubalani@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("jyCagas@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("evVillela-Go@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("arCastro@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("jcLapesigue@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("cdLariosa@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("rdAngoy@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("rbJubane@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("jmAbarca@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("bfAcosta@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("mrSalazar@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("prSolon@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("raSolana@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFaculty("maGuinomla@up.edu.ph").faculty_id },

      // DURP Faculty Members
      { program_id: durpProgram.program_id, faculty_id: getFaculty("irMalaqueIII@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFaculty("anRegalado@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFaculty("mcRosel@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFaculty("rcSongcayauon@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFaculty("mpYares@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFaculty("mvGuillen@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFaculty("sbAntipolo@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFaculty("jaSumabal@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFaculty("mcSuelto@up.edu.ph").faculty_id },

      // MAURP Faculty Members (same as DURP)
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("irMalaqueIII@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("anRegalado@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("mcRosel@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("rcSongcayauon@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("mpYares@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("mvGuillen@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("sbAntipolo@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("jaSumabal@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFaculty("mcSuelto@up.edu.ph").faculty_id },

      // MS Biology Faculty Members
      { program_id: msbProgram.program_id, faculty_id: getFaculty("maAchondo@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("faCamino@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("aeDeCadiz@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("adDelima@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("ldGamalo@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("jaMantiquilla@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("csMillado@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("leMurao@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("clNanola@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("maResponte@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("rlCatiempo@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFaculty("amRaganas@up.edu.ph").faculty_id },

      // MS Human Movement Science Faculty Members (same as DESS)
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("jcGubalani@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("jyCagas@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("evVillela-Go@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("arCastro@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("jcLapesigue@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("cdLariosa@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("rdAngoy@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("rbJubane@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("jmAbarca@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("bfAcosta@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("mrSalazar@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("prSolon@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("raSolana@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFaculty("maGuinomla@up.edu.ph").faculty_id },

      // MS Food Science Faculty Members
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("jjTagubase@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("jaAlviola@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("kaCalumba@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("dnDelMundo@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("jpFronteras@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("evFundador@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("nvFundador@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("jgTolentino@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("reVillame-Gayagas@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("maAlpos-Entero@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFaculty("jbCerna@up.edu.ph").faculty_id },

      // Master in Management Faculty Members
      { program_id: mmProgram.program_id, faculty_id: getFaculty("iaAcopiado@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("trAcuna@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("rtAguinaldo@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("paAlviolaIV@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("mcCastro@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("lnDigal@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("avGomez@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("gaRomo@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("jpSarmiento@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("lrLeal@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("vaShuck@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("raLopez@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFaculty("spPlacencia@up.edu.ph").faculty_id },

      // PhD by Research Faculty Members (same as some MM Faculty Members)
      { program_id: phdByResearchProgram.program_id, faculty_id: getFaculty("paAlviolaIV@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFaculty("lnDigal@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFaculty("avGomez@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFaculty("gaRomo@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFaculty("jpSarmiento@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFaculty("lrLeal@up.edu.ph").faculty_id },
    ]
  });

  // =======================
  // COURSE POOL
  // =======================

  // Master in Management Course Pools
  await prisma.coursePool.create({
    data: {
      name: "Electives",
      program_id: mmProgram.program_id,
      entries: {
        create: [
          { course_id: getCourse("ABM 230").course_id },
          { course_id: getCourse("ABM 234").course_id },
          { course_id: getCourse("DM 231").course_id },
          { course_id: getCourse("DM 232").course_id },
          { course_id: getCourse("DM 233").course_id },
          { course_id: getCourse("IR 204").course_id },
          { course_id: getCourse("IR 211").course_id },
          { course_id: getCourse("M201").course_id },
          { course_id: getCourse("M205").course_id },
          { course_id: getCourse("M234").course_id },
          { course_id: getCourse("M235").course_id },
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
  const mmStudyPlan = await prisma.studyPlan.create({
    data: {
      years: 2,
      name: "Standard Plan",
      program_id: mmProgram.program_id,
    }
  });

  const phdByResearchStudyPlan1 = await prisma.studyPlan.create({
    data: {
      years: 4,
      name: "Standard 4 Year Plan",
      program_id: phdByResearchProgram.program_id,
    }
  });

  const phdByResearchStudyPlan2 = await prisma.studyPlan.create({
    data: {
      years: 3,
      name: "Standard 3 Year Plan",
      program_id: phdByResearchProgram.program_id,
    }
  });

  const msbStudyPlan = await prisma.studyPlan.create({
    data: {
      years: 2,
      name: "Standard Plan",
      program_id: msbProgram.program_id,
    }
  });

  // =======================
  // PROGRAM COURSES
  // =======================
  await prisma.programCourse.createMany({
    data: [
      // Master in Management Study Plan
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M206").course_id, year: 1, semester: 1 },
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M209").course_id, year: 1, semester: 1 },
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M210").course_id, year: 1, semester: 1 },

      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M211").course_id, year: 1, semester: 2 },
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M212").course_id, year: 1, semester: 2 },
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M216").course_id, year: 1, semester: 2 },

      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M217").course_id, year: 2, semester: 1 },
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("MGT213").course_id, year: 2, semester: 1 },
      { study_plan_id: mmStudyPlan.study_plan_id, course_id: getCourse("M224").course_id, year: 2, semester: 1 },

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
      recommendation_url: "",
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
