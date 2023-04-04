import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const sources = [
  {
    name: 'Reddit - For Hire',
    description: '',
  },
  {
    name: 'Reddit - RemoteJs',
    description: '',
  },
  {
    name: 'Reddit - Test',
    description: '',
  },
];
async function main() {
  for (const source of sources) {
    await db.source.create({
      data: source,
    });
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
