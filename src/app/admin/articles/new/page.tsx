import prisma from "@/lib/prisma"
import { ArticleEditor } from "@/components/admin/ArticleEditor"

export default async function NewArticlePage() {
  const [categories, authors, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <ArticleEditor
      categories={categories}
      authors={authors}
      tags={tags}
    />
  )
}
