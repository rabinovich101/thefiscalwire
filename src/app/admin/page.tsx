// Force dynamic rendering - no static generation at build time
export const dynamic = "force-dynamic";

import Link from "next/link"
import prisma from "@/lib/prisma"
import { FileText, FolderOpen, Users, Plus } from "lucide-react"

export default async function AdminDashboard() {
  const [articleCount, categoryCount, authorCount] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.author.count(),
  ])

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true, marketsCategory: true, businessCategory: true, author: true },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Total Articles</p>
              <p className="text-2xl font-bold text-white">{articleCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <FolderOpen className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Categories</p>
              <p className="text-2xl font-bold text-white">{categoryCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Authors</p>
              <p className="text-2xl font-bold text-white">{authorCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Recent Articles</h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {recentArticles.map((article) => (
            <div key={article.id} className="p-4 flex items-center justify-between">
              <div>
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="text-white hover:text-blue-400 font-medium"
                >
                  {article.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {article.marketsCategory && (
                    <span className="text-xs text-zinc-500">
                      {article.marketsCategory.name}
                    </span>
                  )}
                  {article.businessCategory && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500">
                        {article.businessCategory.name}
                      </span>
                    </>
                  )}
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500">
                    {article.author.name}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-zinc-800">
          <Link
            href="/admin/articles"
            className="text-sm text-blue-500 hover:text-blue-400"
          >
            View all articles →
          </Link>
        </div>
      </div>
    </div>
  )
}
