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

      // Diploma in Urban and Regional Planning Core Courses 
      { name: "Theory and Practice of Planning", code: "P201", type: "core", units: 3 },
      { name: "Land Use Planning", code: "P203", type: "core", units: 3 },
      { name: "Project Planning and Development", code: "P205", type: "core", units: 3 },
      { name: "Planning Process", code: "P210", type: "core", units: 3 },
      { name: "Planning Workshop", code: "P210.1", type: "core", units: 5 },
      { name: "Planning Analysis and Techniques", code: "P214", type: "core", units: 3 },
      { name: "Site Planning", code: "P231", type: "core", units: 3 },
      { name: "Research Methods in Planning", code: "P299", type: "core", units: 3 },

      // Additional Courses for Master of Arts in Urban and Regional Planning
      { name: "Special Problems in Regional Planning", code: "P229", type: "required", units: 3 },
      { name: "MASTER'S THESIS", code: "P300", type: "required", units: 6 },

      // Diploma in Exercise and Sports Science Core Courses

      // Additional Courses for Master of Science in Human Movement Science


      // Master in Biology Core Courses
      { name: "Chemical Physiology", code: "BIO 220", type: "core", units: 3 },
      { name: "Advanced Genetics", code: "BIO 240", type: "core", units: 3 },
      { name: "Differentiation in Embryonic Systems", code: "BIO 230", type: "core", units: 3 },
      { name: "Advanced Cell and Molecular Biology", code: "BIO 250", type: "core", units: 3 },
      { name: "Advanced Ecology", code: "BIO 260", type: "core", units: 3 },

      { name: "Seminar", code: "BIO 296", type: "required", units: 1 },
      { name: "Research in Biology", code: "BIO 299", type: "required", units: 2 },
      { name: "Thesis", code: "BIO 300", type: "required", units: 6 },
      
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
          application_requirements: "",
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
      description: "The Diploma in Urban and Regional Planning (DURP) is offered by UP in Mindanao to enable professional planners to respond more effectively to the steadyily increasing demands of development. This program will equip urban an regional planners with knowledge and skills to carry out the national policy of the comprehensive planning and devlopment.",
      history: "The Diploma in Urban and Regional Planning (DURP) along with the Master in Urban and Regional Planning (MAURP) program at the University of the Philippines Mindanao was reoffered in the Second Semester of Academic Year 2016-2017. The program was revived under the Department of Architecture following approval by the UP Mindanao University Council in November 2016.",

      program_application: {
        create: {
          qualifications: "TBA",
          application_instructions: "Interested applicants may fill out the form and submit the requirements via the application URL below. The reference forms are to be duly accomplished by at least 2 references and sent directly to architecture.upmin@up.edu.ph.",
          application_requirements: "A bachelor's degree from a recognized institution of higher learning; A minimum weighted average grade of 2.5 or its equivalent; Relevant work experience of at least two years; A favorable letter of recommendation from a former superior and at least one other person who is well acquainted with, but not related to the applicant; Passing the Graduate Admission Test; Favorable assessment of interview results.",
          application_url: "http://bit.ly/UPMindanaoDURP2023",
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
      name: "Master of Arts in Urban and Regional Planning",
      description: "The Master of Arts in Urban and Regional Planning at UP Mindanao is a ladderized graduate program designed to develop leadership, management, and research skills for planning professionals, specifically addressing the growing demands of urbanization and development in the Mindanao region.",
      history: "The Master in Urban and Regional Planning (MAURP) program at the University of the Philippines Mindanao was originally offered by the School of Management (SOM) before being revived under the Department of Architecture on November 2016.",

      program_application: {
        create: {
          qualifications: "To qualify for the Master's Program (MAURP), a student must have a weighted average of 1.75 or better in his/her Diploma Program and upon he recommendation of the Program Adviser and approval of the Dean.",
          application_instructions: "TBA",
          application_requirements: "TBA",
          application_url: "https://apply.com",
          recommendation_url: "https://reco.com"
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
          recommendation_url: "N/A"
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
          qualifications: "TBA",
          application_instructions: "TBA",
          application_requirements: "Duly accomplished application form (Form 1); Cover letter signifying intent and degree sought, addressed to the Department Chair: Assoc. Dann Marie N. Del Mundo, Ph.D.; Updated Curriculum Vitae; Original or certified true copy of official Transcript of Records (TOR); True Copy of Grades showing your final General Weighted Average (GWA); Two letters of recommendation (Form 2) – one from your former professor and one from your employer or direct supervisor; Payment receipt/proof of payment for the non-refundable fee amounting to PHP 200.00. Must be deposited to the following account: Account name: UP Mindanao Revolving Fund; Account number: 00-0-00494-915-2; Name of Bank: Development Bank of the Philippines; Branch: Davao City; All files should be in PDF format. Email the documents to the MSHMS Coordinator, Assoc. Micah Amor P. Yares, Ph.D., at mayares@up.edu.ph on or before June 30, 2024.",
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
          qualifications: "TBA",
          application_instructions: "TBA",
          application_requirements: "TBA",
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
      history: "TBA",

      program_application: {
        create: {
          qualifications: "TBA",
          application_instructions: "The school accepts application for the program from November to May of the following year. Submit the duly accomplished application forms together with (1) your official transcript of records, (2) reciept of application free (P200.00) payable at our Cash Office, and (3) reciept for the examination Fee (P250.00) payable at our office.",
          application_requirements: "A bachelor's degree in any field of study; A minimum of 2.5 or equivalent average grade; At least two years of managerial or supervisory experience; A favorable recommendation from a superior and at least one other person who is well acquainted with, but not related to the applicant; Passing the Graduate Admission Test; Favorable assessment of interview results; Attendance to the Bridging Program.",
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
          qualifications: "TBA",
          application_instructions: "TBA",
          application_requirements: "TBA",
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
      // Program Coordinators
      { name: "Jackie Lou J. Tagubase", email: "jjTagubase@up.edu.ph", photo: "photo1.jpg", position: "Associate Professor" }, // MS Food Science Coordinator
      { name: "Micah Amor P. Yares", email: "mpYares@up.edu.ph", photo: "photo2.jpg", position: "Assistant Professor" }, // MA Urban and Regional Planning Coordinator
      { name: "Mae A. Responte", email: "maResponte@up.edu.ph", photo: "photo3.jpg", position: "Assistant Professor" }, // MS Biology Coordinator
      { name: "Imee Marie A. Acopiado ", email: "iaAcopiado@up.edu.ph", photo: null, position: "Assistant Professor" }, // MM Coordinator
      { name: "Pedro A. Alviola IV", email: "paAlviola@up.edu.ph", photo: "photo5.jpg", position: "Professor" }, // PhD by Research Coordinator
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
      { name: "Mae A. Responté", email: "maResponté@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Rose L. Catiempo", email: "rlCatiempo@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      { name: "Aaron Froilan M. Raganas", email: "amRaganas@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
      
      // Master in Management Faculty Members (also PhD by Research Faculty Members)
      { name: "Thaddeus R. Acuña", email: "trAcuña@up.edu.ph", photo: "photo5.jpg", position: "Assistant Professor" },
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
    ]
  });

  const faculties = await prisma.faculty.findMany();
  const getFaculty = (email) => faculties.find(f => f.email === email);

  await prisma.facultyCredential.createMany({
    data: [
      // MS Food Science Faculty Credentials
      { degree: "MS Food Science", faculty_id: getFaculty("jlTagubase@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("jnAlviola@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("kfCalumba@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("dmDelMundo@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("jFronteras@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("eoFundador@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("ngFundador@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("jhTolentino@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("rgVillame-Gayagas@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("mAlpos-Entero@up.edu.ph").faculty_id },
      { degree: "MS Food Science", faculty_id: getFaculty("jCerna@up.edu.ph").faculty_id },

      // MS Biology Faculty Credentials
      { degree: "MS Biology", faculty_id: getFaculty("mjAchondo@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("fCamino@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("aDeCadiz@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("agDelima@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("leGamalo@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("jMantiquilla@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("csMillado@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("lMurao@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("cNanola@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("mResponté@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("rCatiempo@up.edu.ph").faculty_id },
      { degree: "MS Biology", faculty_id: getFaculty("afRaganas@up.edu.ph").faculty_id },

      // Master in Management Faculty Credentials
      { degree: "Master in Management", faculty_id: getFaculty("imAcopiado@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("tAcuña@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("rAguinaldo@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("pAlviolaIV@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("mmCastro@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("lDigal@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("alGomez@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("gdRomo@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("jmSarmiento@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("lLeal@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("vShuck@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("rLopez@up.edu.ph").faculty_id },
      { degree: "Master in Management", faculty_id: getFaculty("sgPlacencia@up.edu.ph").faculty_id },

      // Diploma of Exercise and Sports Science Faculty Credentials
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("jGubalani@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("jCagas@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("emVillela-Go@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("aCastro@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("jLapesigue@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("cjLariosa@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("rAngoy@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("rJubane@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("jAbarca@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("bjAcosta@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("msSalazar@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("pgSolon@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("riSolana@up.edu.ph").faculty_id },
      { degree: "Diploma of Exercise and Sports Science", faculty_id: getFaculty("mkGuinomla@up.edu.ph").faculty_id },

      // Master of Science in Human Movement Science Faculty Credentials (same as DESS Faculty Credentials)
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("jGubalani@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("jCagas@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("emVillela-Go@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("aCastro@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("jLapesigue@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("cjLariosa@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("rAngoy@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("rJubane@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("jAbarca@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("bjAcosta@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("msSalazar@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("pgSolon@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("riSolana@up.edu.ph").faculty_id },
      { degree: "Master of Science in Human Movement Science", faculty_id: getFaculty("mkGuinomla@up.edu.ph").faculty_id },

      // Diploma in Urban and Regional Planning
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("iMalaqueIII@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("afRegalado@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("mRosel@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("rSongcayauon@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("maYares@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("mdGuillen@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("sAntipolo@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("jrSumabal@up.edu.ph").faculty_id },
      { degree: "Diploma in Urban and Regional Planning", faculty_id: getFaculty("mSuelto@up.edu.ph").faculty_id },

      // Master of Arts in Urban and Regional Planning Faculty Credentials (same as DURP Faculty Credentials)
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("iMalaqueIII@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("afRegalado@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("mRosel@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("rSongcayauon@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("maYares@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("mdGuillen@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("sAntipolo@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("jrSumabal@up.edu.ph").faculty_id },
      { degree: "Master of Arts in Urban and Regional Planning", faculty_id: getFaculty("mSuelto@up.edu.ph").faculty_id },

      // PhD by Research Faculty Credentials (some are the same as MM Faculty Credentials)
      { degree: "PhD by Research", faculty_id: getFaculty("pAlviolaIV@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("lDigal@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("alGomez@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("gdRomo@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("jmSarmiento@up.edu.ph").faculty_id },
      { degree: "PhD by Research", faculty_id: getFaculty("lLeal@up.edu.ph").faculty_id },
    ]
  });

  // =======================
  // PROGRAM FACULTY
  // =======================
  await prisma.programFaculty.createMany({
    data: [
      // DESS Faculty Members
      { program_id: dessProgram.program_id, faculty_id: getFactulty("jGubalani@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("jCagas@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("emVillela-Go@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("aCastro@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("jLapesigue@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("cjLariosa@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("rAngoy@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("rJubane@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("jAbarca@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("bjAcosta@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("msSalazar@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("pgSolon@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("riSolana@up.edu.ph").faculty_id },
      { program_id: dessProgram.program_id, faculty_id: getFactulty("mkGuinomla@up.edu.ph").faculty_id },

      // DURP Faculty Members
      { program_id: durpProgram.program_id, faculty_id: getFactulty("iMalaqueIII@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFactulty("afRegalado@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFactulty("mRosel@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFactulty("rSongcayauon@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFactulty("maYares@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFactulty("mdGuillen@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFactulty("sAntipolo@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFactulty("jrSumabal@up.edu.ph").faculty_id },
      { program_id: durpProgram.program_id, faculty_id: getFactulty("mSuelto@up.edu.ph").faculty_id },

      // MAURP Faculty Members (same as DURP)
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("iMalaqueIII@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("afRegalado@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("mRosel@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("rSongcayauon@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("maYares@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("mdGuillen@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("sAntipolo@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("jrSumabal@up.edu.ph").faculty_id },
      { program_id: maurpProgram.program_id, faculty_id: getFactulty("mSuelto@up.edu.ph").faculty_id },

      // MS Biology Faculty Members
      { program_id: msbProgram.program_id, faculty_id: getFactulty("mjAchondo@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("fCamino@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("aDeCadiz@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("agDelima@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("leGamalo@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("jMantiquilla@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("csMillado@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("lMurao@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("cNanola@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("mResponté@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("rCatiempo@up.edu.ph").faculty_id },
      { program_id: msbProgram.program_id, faculty_id: getFactulty("afRaganas@up.edu.ph").faculty_id },

      // MS Human Movement Science Faculty Members (same as DESS)
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("jGubalani@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("jCagas@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("emVillela-Go@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("aCastro@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("jLapesigue@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("cjLariosa@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("rAngoy@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("rJubane@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("jAbarca@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("bjAcosta@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("msSalazar@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("pgSolon@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("riSolana@up.edu.ph").faculty_id },
      { program_id: mshmsProgram.program_id, faculty_id: getFactulty("mkGuinomla@up.edu.ph").faculty_id },

      // MS Food Science Faculty Members
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("jlTagubase@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("jnAlviola@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("kfCalumba@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("dmDelMundo@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("jFronteras@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("eoFundador@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("ngFundador@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("jhTolentino@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("rgVillame-Gayagas@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("mAlpos-Entero@up.edu.ph").faculty_id },
      { program_id: msfsProgram.program_id, faculty_id: getFactulty("jCerna@up.edu.ph").faculty_id },

      // Master in Management Faculty Members
      { program_id: mmProgram.program_id, faculty_id: getFactulty("imAcopiado@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("tAcuña@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("rAguinaldo@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("pAlviolaIV@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("mmCastro@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("lDigal@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("alGomez@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("gdRomo@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("jmSarmiento@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("lLeal@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("vShuck@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("rLopez@up.edu.ph").faculty_id },
      { program_id: mmProgram.program_id, faculty_id: getFactulty("sgPlacencia@up.edu.ph").faculty_id },

      // PhD by Research Faculty Members (same as some MM Faculty Members)
      { program_id: phdByResearchProgram.program_id, faculty_id: getFactulty("pAlviolaIV@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFactulty("lDigal@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFactulty("alGomez@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFactulty("gdRomo@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFactulty("jmSarmiento@up.edu.ph").faculty_id },
      { program_id: phdByResearchProgram.program_id, faculty_id: getFactulty("lLeal@up.edu.ph").faculty_id },
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
