import { Notice } from '../../abstract/Notice';
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
    const prismaNotice = await prisma.notice.create({
      data,
      include: { keywords: true, source: true },
    });

    return prismaNotice;
  }

  // private convertToNotice(prismaNotice: PrismaNotice & { keywords: PrismaKeyword[]; source: PrismaSource }): Notice {
  //   const { id, title, body, url, authorName, authorUrl, imageUrl, createdAt, updatedAt, raw, keywords, sourceId } =
  //     prismaNotice;

  //   return {
  //     title,
  //     body,
  //     url,
  //     authorName,
  //     authorUrl,
  //     imageUrl: imageUrl || undefined,
  //     raw,
  //     keywords: keywords.map((keyword) => keyword.value),
  //   };
  // }
}

export { NoticeDAO, Notice, Keyword, Source };
