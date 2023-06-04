UPDATE "Notice" SET "sourceId" = (SELECT "id" FROM "Source" WHERE "name" = 'Reddit');
