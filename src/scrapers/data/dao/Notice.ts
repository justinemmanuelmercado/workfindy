import { Prisma } from '@prisma/client';
import type { Notice } from '../../abstract/Notice';
import { prisma } from '../prisma-client';

interface Keyword {
  id: string;
  value: string;
  notices?: Notice[];
}

interface Source {
  id: string;
  name: string;
  description?: string;
  notices?: Notice[];
}

class NoticeDAO {
  async create(data: Omit<Notice, 'keywords' | 'sourceName'> & { sourceId: string }) {
    try {
      const prismaNotice = await prisma.notice.create({
        data,
        include: { keywords: true, source: true },
      });
      return prismaNotice;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        console.log(`Already inserted ${data.title} from ${data.sourceId}; Skipping...`);
        return null;
      } else {
        throw error;
      }
    }
  }
}

export { NoticeDAO, Notice };
export type { Keyword, Source };
