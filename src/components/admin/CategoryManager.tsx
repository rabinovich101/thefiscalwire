"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, X, Check } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  color: string
  _count: { articles: number }
}

const colorOptions = [
  { value: "bg-blue-600", label: "Blue" },
  { value: "bg-green-600", label: "Green" },
  { value: "bg-red-600", label: "Red" },
  { value: "bg-yellow-600", label: "Yellow" },
  { value: "bg-purple-600", label: "Purple" },
  { value: "bg-pink-600", label: "Pink" },
  { value: "bg-orange-600", label: "Orange" },
  { value: "bg-gray-600", label: "Gray" },
]

export function CategoryManager({ categories: initialCategories }: { categories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", color: "bg-blue-600" })
  const [editCategory, setEditCategory] = useState({ name: "", slug: "", color: "" })

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        setIsAdding(false)
        setNewCategory({ name: "", slug: "", color: "bg-blue-600" })
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create category")
      }
    } catch (error) {
      alert("Failed to create category")
    }
  }

  const handleEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory),
      })

      if (response.ok) {
        setEditingId(null)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update category")
      }
    } catch (error) {
      alert("Failed to update category")
    }
  }

  const handleDelete = async (id: string, articleCount: number) => {
    if (articleCount > 0) {
      alert("Cannot delete category with articles. Move articles to another category first.")
      return
    }

    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete category")
      }
    } catch (error) {
      alert("Failed to delete category")
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditCategory({ name: category.name, slug: category.slug, color: category.color })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Name</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Slug</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Color</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-4 py-3">Articles</th>
              <th className="text-right text-sm font-medium text-zinc-400 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {isAdding && (
              <tr className="bg-zinc-800/50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({
                      ...newCategory,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })}
                    className="w-full px-3 py-1 bg-zinc-900 border border-zinc-600 rounded text-white"
                    placeholder="Category name"
                    autoFocus
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    className="w-full px-3 py-1 bg-zinc-900 border border-zinc-600 rounded text-white"
                    placeholder="slug"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="px-3 py-1 bg-zinc-900 border border-zinc-600 rounded text-white"
                  >
                    {colorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-zinc-400">-</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={handleAdd}
                      className="p-2 text-green-400 hover:text-green-300"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false)
                        setNewCategory({ name: "", slug: "", color: "bg-blue-600" })
                      }}
                      className="p-2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-zinc-800/50">
                <td className="px-4 py-3">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editCategory.name}
                      onChange={(e) => setEditCategory({
                        ...editCategory,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })}
                      className="w-full px-3 py-1 bg-zinc-900 border border-zinc-600 rounded text-white"
                    />
                  ) : (
                    <span className="text-white font-medium">{category.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editCategory.slug}
                      onChange={(e) => setEditCategory({ ...editCategory, slug: e.target.value })}
                      className="w-full px-3 py-1 bg-zinc-900 border border-zinc-600 rounded text-white"
                    />
                  ) : (
                    <span className="text-zinc-400">{category.slug}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === category.id ? (
                    <select
                      value={editCategory.color}
                      onChange={(e) => setEditCategory({ ...editCategory, color: e.target.value })}
                      className="px-3 py-1 bg-zinc-900 border border-zinc-600 rounded text-white"
                    >
                      {colorOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded ${category.color} text-white`}>
                      {category.color.replace("bg-", "").replace("-600", "")}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-400">{category._count.articles}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={() => handleEdit(category.id)}
                          className="p-2 text-green-400 hover:text-green-300"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-zinc-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(category)}
                          className="p-2 text-zinc-400 hover:text-blue-400"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category._count.articles)}
                          className="p-2 text-zinc-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
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
