"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, X, Check, Image as ImageIcon } from "lucide-react"

interface Author {
  id: string
  name: string
  avatar: string | null
  bio: string | null
  _count: { articles: number }
}

export function AuthorManager({ authors: initialAuthors }: { authors: Author[] }) {
  const router = useRouter()
  const [authors] = useState(initialAuthors)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newAuthor, setNewAuthor] = useState({ name: "", avatar: "", bio: "" })
  const [editAuthor, setEditAuthor] = useState({ name: "", avatar: "", bio: "" })

  const handleImageUpload = async (target: "new" | "edit", file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        if (target === "new") {
          setNewAuthor((prev) => ({ ...prev, avatar: url }))
        } else {
          setEditAuthor((prev) => ({ ...prev, avatar: url }))
        }
      }
    } catch (error) {
      alert("Failed to upload image")
    }
  }

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/admin/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAuthor),
      })

      if (response.ok) {
        setIsAdding(false)
        setNewAuthor({ name: "", avatar: "", bio: "" })
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create author")
      }
    } catch (error) {
      alert("Failed to create author")
    }
  }

  const handleEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/authors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAuthor),
      })

      if (response.ok) {
        setEditingId(null)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update author")
      }
    } catch (error) {
      alert("Failed to update author")
    }
  }

  const handleDelete = async (id: string, articleCount: number) => {
    if (articleCount > 0) {
      alert("Cannot delete author with articles. Reassign articles first.")
      return
    }

    if (!confirm("Are you sure you want to delete this author?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/authors/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete author")
      }
    } catch (error) {
      alert("Failed to delete author")
    }
  }

  const startEdit = (author: Author) => {
    setEditingId(author.id)
    setEditAuthor({ name: author.name, avatar: author.avatar || "", bio: author.bio || "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Authors</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Author
        </button>
      </div>

      {/* Add New Author Form */}
      {isAdding && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Author</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Avatar</label>
              <div className="flex items-center gap-3">
                {newAuthor.avatar ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={newAuthor.avatar} alt="" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-zinc-500" />
                  </div>
                )}
                <label className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-300 cursor-pointer hover:bg-zinc-700">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload("new", file)
                    }}
                  />
                </label>
                <input
                  type="text"
                  value={newAuthor.avatar}
                  onChange={(e) => setNewAuthor({ ...newAuthor, avatar: e.target.value })}
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm"
                  placeholder="Or enter URL"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Bio</label>
              <textarea
                value={newAuthor.bio}
                onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                placeholder="Author bio (optional)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setIsAdding(false)
                setNewAuthor({ name: "", avatar: "", bio: "" })
              }}
              className="px-4 py-2 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Author
            </button>
          </div>
        </div>
      )}

      {/* Authors List */}
      <div className="grid gap-4">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
          >
            {editingId === author.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Name</label>
                    <input
                      type="text"
                      value={editAuthor.name}
                      onChange={(e) => setEditAuthor({ ...editAuthor, name: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Avatar</label>
                    <div className="flex items-center gap-3">
                      {editAuthor.avatar ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image src={editAuthor.avatar} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                      <label className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-300 cursor-pointer hover:bg-zinc-700">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload("edit", file)
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={editAuthor.avatar}
                        onChange={(e) => setEditAuthor({ ...editAuthor, avatar: e.target.value })}
                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm"
                        placeholder="Or enter URL"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-zinc-400 mb-2">Bio</label>
                    <textarea
                      value={editAuthor.bio}
                      onChange={(e) => setEditAuthor({ ...editAuthor, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(author.id)}
                    className="p-2 text-green-400 hover:text-green-300"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {author.avatar ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image src={author.avatar} alt={author.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-lg font-medium text-zinc-400">
                        {author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-medium">{author.name}</h3>
                    <p className="text-sm text-zinc-400">
                      {author._count.articles} article{author._count.articles !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(author)}
                    className="p-2 text-zinc-400 hover:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(author.id, author._count.articles)}
                    className="p-2 text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
