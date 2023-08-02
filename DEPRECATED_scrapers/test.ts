import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getSource() {
  const sources = await prisma.source.findMany();
  console.log(sources);
}

getSource();
