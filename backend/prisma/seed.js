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

  console.log('Seed data inserted!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
