import { Prisma, PrismaClient } from "@prisma/client";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);

export const prisma: PrismaClient = global.prisma || new PrismaClient();
export const timeAgo = global.timeAgo || new TimeAgo('en-US');


if (process.env.NODE_ENV !== "production") global.prisma = prisma;
if (process.env.NODE_ENV !== "production") global.timeAgo = timeAgo;