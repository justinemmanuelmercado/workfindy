import { Prisma, PrismaClient } from '@prisma/client';
import { decode } from 'html-entities';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import _ from 'lodash';
TimeAgo.addDefaultLocale(en);

export const prisma: PrismaClient = global.prisma || new PrismaClient();
export const timeAgo = global.timeAgo || new TimeAgo('en-US');

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
if (process.env.NODE_ENV !== 'production') global.timeAgo = timeAgo;

type QueryParam = {
  key: string;
  value: string | string[];
};

const { truncate } = _;

export function buildQueryString(params: QueryParam[]): string {
  return params
    .map((param) => {
      const key = encodeURIComponent(param.key);
      const value = Array.isArray(param.value)
        ? param.value.map((v) => `${key}=${encodeURIComponent(v)}`).join('&')
        : `${key}=${encodeURIComponent(param.value)}`;
      return value;
    })
    .join('&');
}

export const toRelativeDate = (date: Date | null) => {
  if (!date) {
    return 'Unknown';
  }
  return timeAgo.format(date);
};

// Removes html tags and escaped html tags
export const printToHtmlAndTruncate = (text: string, length: number) => {
  // If id is in cache return it
  const htmlString = decode(text, { level: 'html5' });
  const html = htmlString.replace(/<[^>]*>?/gm, '');
  // Set cache for notice here
  // Double encoding because of stupid strings from reddit like this I&amp;#39;m
  return truncate(decode(html), { length, separator: '...' });
};