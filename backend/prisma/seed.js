import { prisma } from '../db/db.js';
async function main() {
  // directly insert into the database
  await prisma.office.create({
    data: {
      name: 'Graduate Studies Office',
      logo: '/public/seed-assets/office/default-logo.png',
      objectives: 'Excellence in graduate education',
      location: 'Admin Building',
      contact_info: '123-4567',
      email: 'grad@university.edu'
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
