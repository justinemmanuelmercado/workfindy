/*
  Warnings:

  - A unique constraint covering the columns `[guid,sourceId]` on the table `Notice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Notice_guid_key";

-- CreateIndex
CREATE UNIQUE INDEX "Notice_guid_sourceId_key" ON "Notice"("guid", "sourceId");
