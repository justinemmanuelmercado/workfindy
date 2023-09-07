-- Delete all notices with title length is less than 10 and where body length is less than 10 where sourceId = "HackerNews"

DELETE FROM "Notice" WHERE LENGTH("title") < 10 AND LENGTH("body") < 10 AND "sourceId" = 'HackerNews';

-- Instructions to run this in the command line
-- 1. Run `psql -U postgres -d prisma -f prisma/scripts/delete_dead_hackernews_2.sql`