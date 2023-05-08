import type { Notice } from '../../abstract/Notice';
import { NoticeDAO } from '../dao/Notice';
import { getSource } from './source';
import omit from 'lodash/omit';

const dao = new NoticeDAO();

export const createNotice = async (notice: Notice) => {
  const source = await getSource(notice.sourceName);
  if (source) {
    const omitted = omit<Notice, 'sourceName' | 'keywords'>(notice, ['sourceName', 'keywords']);
    dao.create({
      ...omitted,
      sourceId: source.id,
    });
  }
};
