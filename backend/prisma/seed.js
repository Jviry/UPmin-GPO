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

  console.log('Seed data inserted!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
