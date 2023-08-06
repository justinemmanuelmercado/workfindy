import { Prisma, PrismaClient } from "@prisma/client";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);

export const prisma: PrismaClient = global.prisma || new PrismaClient();
export const timeAgo = global.timeAgo || new TimeAgo('en-US');

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
if (process.env.NODE_ENV !== "production") global.timeAgo = timeAgo;

type QueryParam = {
  key: string;
  value: string | string[];
};

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