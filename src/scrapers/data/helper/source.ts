import { Source } from '@prisma/client';
import { prisma } from '../prisma-client';

const sourceCache = new Map<string, Source>();

export async function getSource(name: string): Promise<Source | null> {
  const cachedSource = sourceCache.get(name);
  if (cachedSource) {
    return cachedSource;
  }

  const source = await prisma.source.findUnique({
    where: { name },
  });

  if (source) {
    sourceCache.set(name, source);

    return source;
  } else {
    return null;
  }
}
