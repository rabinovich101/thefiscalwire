// Force dynamic rendering - no static generation at build time
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma"
import { ArticleEditor } from "@/components/admin/ArticleEditor"

export default async function NewArticlePage() {
  const [allCategories, authors, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ])

  // Filter categories by type
  const marketsCategories = allCategories.filter(c => c.type === "MARKETS")
  const businessCategories = allCategories.filter(c => c.type === "BUSINESS")

  return (
    <ArticleEditor
      marketsCategories={marketsCategories}
      businessCategories={businessCategories}
      authors={authors}
      tags={tags}
    />
  )
}
