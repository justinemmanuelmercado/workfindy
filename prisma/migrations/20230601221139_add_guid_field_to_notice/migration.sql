/*
  Warnings:

  - A unique constraint covering the columns `[guid]` on the table `Notice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "guid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Notice_guid_key" ON "Notice"("guid");
