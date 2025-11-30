import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ArticleEditor } from "@/components/admin/ArticleEditor"

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params

  const [article, categories, authors, tags] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!article) {
    notFound()
  }

  // Transform article data for the editor
  const articleData = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content as any[],
    imageUrl: article.imageUrl,
    readTime: article.readTime,
    isFeatured: article.isFeatured,
    isBreaking: article.isBreaking,
    categoryId: article.categoryId,
    authorId: article.authorId,
    tags: article.tags,
    relevantTickers: article.relevantTickers,
  }

  return (
    <ArticleEditor
      article={articleData}
      categories={categories}
      authors={authors}
      tags={tags}
    />
  )
}
