-- AlterTable
ALTER TABLE "Article" ADD COLUMN "externalId" TEXT;
ALTER TABLE "Article" ADD COLUMN "sourceUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Article_externalId_key" ON "Article"("externalId");
