import Link from "next/link"
import prisma from "@/lib/prisma"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton"

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">
                Title
              </th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">
                Category
              </th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">
                Author
              </th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">
                Published
              </th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">
                Status
              </th>
              <th className="text-right text-sm font-medium text-zinc-400 px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-zinc-800/50">
                <td className="px-4 py-3">
                  <span className="text-white font-medium">{article.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${article.category.color} text-white`}
                  >
                    {article.category.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400">{article.author.name}</td>
                <td className="px-4 py-3 text-zinc-400 text-sm">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {article.isFeatured && (
                      <span className="text-xs px-2 py-1 rounded bg-yellow-600/20 text-yellow-500">
                        Featured
                      </span>
                    )}
                    {article.isBreaking && (
                      <span className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-500">
                        Breaking
                      </span>
                    )}
                    {!article.isFeatured && !article.isBreaking && (
                      <span className="text-xs text-zinc-500">Normal</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/article/${article.slug}`}
                      target="_blank"
                      className="p-2 text-zinc-400 hover:text-white transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="p-2 text-zinc-400 hover:text-blue-400 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteArticleButton articleId={article.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
