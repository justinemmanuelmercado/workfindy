import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const sources = [
  {
    name: 'Reddit',
    description: '',
    homepage: 'https://www.reddit.com',
  },
  {
    name: 'WeWorkRemotely',
    description: '',
    homepage: 'https://weworkremotely.com',
  },
  {
    name: 'Remotive',
    description: '',
    homepage: 'https://remotive.io',
  },
  {
    name: 'RemoteOK',
    description: '',
    homepage: 'https://remoteok.io',
  },
  {
    name: 'JobIcy',
    description: '',
    homepage: 'https://jobicy.com',
  },
  {
    name: 'HackerNews',
    description: '',
    homepage: 'https://news.ycombinator.com',
  },
  {
    name: 'FOSSJobs',
    description: '',
    homepage: 'https://www.fossjobs.net',
  }
];

async function main() {
  for (const source of sources) {
    try {
      await db.source.upsert({
        where: { name: source.name },
        update: source,
        create: source,
      });
    } catch (error) {
      console.log(`Error seeding ${source.name}: ${error.message}`);
    }
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
