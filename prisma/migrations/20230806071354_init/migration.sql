-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "sourceId" TEXT NOT NULL,
    "raw" TEXT NOT NULL,
    "guid" TEXT,
    "publishedDate" TIMESTAMP(3),

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homepage" TEXT DEFAULT '',
    "iconUrl" TEXT DEFAULT '',

    CONSTRAINT "Source_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "_KeywordToNotice" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Notice_guid_sourceId_key" ON "Notice"("guid", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_value_key" ON "Keyword"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Source_name_key" ON "Source"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_KeywordToNotice_AB_unique" ON "_KeywordToNotice"("A", "B");

-- CreateIndex
CREATE INDEX "_KeywordToNotice_B_index" ON "_KeywordToNotice"("B");

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToNotice" ADD CONSTRAINT "_KeywordToNotice_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToNotice" ADD CONSTRAINT "_KeywordToNotice_B_fkey" FOREIGN KEY ("B") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
