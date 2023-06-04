import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const sources = [
  {
    name: 'Reddit',
    description: '',
  },
  {
    name: 'WeWorkRemotely',
    description: '',
  },
  {
    name: 'Remotive',
    description: '',
  },
  {
    name: 'RemoteOK',
    description: '',
  },
  {
    name: 'JobIcy',
    description: '',
  },
  {
    name: 'StackOverflow',
    description: '',
  },
  {
    name: 'HackerNews',
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
