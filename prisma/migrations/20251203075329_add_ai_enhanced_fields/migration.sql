-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "isAiEnhanced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
