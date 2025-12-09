"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Type,
  Heading2,
  Quote,
  List,
  AlertCircle,
  Save,
  Eye,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { UploadButton } from "@/lib/uploadthing"

type BlockType = "paragraph" | "heading" | "image" | "quote" | "list" | "callout"

interface ContentBlock {
  id: string
  type: BlockType
  content?: string
  level?: 2 | 3
  items?: string[]
  imageUrl?: string
  imageCaption?: string
  attribution?: string
}

interface ArticleEditorProps {
  article?: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: ContentBlock[]
    imageUrl: string
    readTime: number
    isFeatured: boolean
    isBreaking: boolean
    marketsCategoryId: string
    businessCategoryId: string
    authorId: string
    tags: { id: string; name: string }[]
    relevantTickers: string[]
  }
  marketsCategories: { id: string; name: string }[]
  businessCategories: { id: string; name: string }[]
  authors: { id: string; name: string }[]
  tags: { id: string; name: string }[]
}

export function ArticleEditor({ article, marketsCategories, businessCategories, authors, tags }: ArticleEditorProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    imageUrl: article?.imageUrl || "",
    readTime: article?.readTime || 5,
    isFeatured: article?.isFeatured || false,
    isBreaking: article?.isBreaking || false,
    marketsCategoryId: article?.marketsCategoryId || marketsCategories[0]?.id || "",
    businessCategoryId: article?.businessCategoryId || businessCategories[0]?.id || "",
    authorId: article?.authorId || authors[0]?.id || "",
    selectedTags: article?.tags.map((t) => t.id) || [],
    relevantTickers: article?.relevantTickers?.join(", ") || "",
  })

  const [blocks, setBlocks] = useState<ContentBlock[]>(
    article?.content || [{ id: crypto.randomUUID(), type: "paragraph", content: "" }]
  )

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: article ? prev.slug : generateSlug(title),
    }))
  }

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: type === "paragraph" || type === "quote" || type === "callout" ? "" : undefined,
      level: type === "heading" ? 2 : undefined,
      items: type === "list" ? [""] : undefined,
      imageUrl: type === "image" ? "" : undefined,
      imageCaption: type === "image" ? "" : undefined,
      attribution: type === "quote" ? "" : undefined,
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter((b) => b.id !== id))
    }
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id)
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) {
      return
    }

    const newBlocks = [...blocks]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
    setBlocks(newBlocks)
  }

  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate both categories are selected
    if (!formData.marketsCategoryId || !formData.businessCategoryId) {
      alert("Both Markets Category and Business Category are required")
      return
    }

    setIsSaving(true)

    const headings = blocks
      .filter((b) => b.type === "heading")
      .map((b) => ({
        id: b.content?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "",
        text: b.content || "",
        level: b.level || 2,
      }))

    const payload = {
      ...formData,
      content: blocks,
      headings,
      relevantTickers: formData.relevantTickers
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      tagIds: formData.selectedTags,
    }

    try {
      const url = article ? `/api/admin/articles/${article.id}` : "/api/admin/articles"
      const method = article ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/admin/articles")
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save article")
      }
    } catch (error) {
      alert("Failed to save article")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id) => id !== tagId)
        : [...prev.selectedTags, tagId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          {article ? "Edit Article" : "New Article"}
        </h1>
        <div className="flex items-center gap-3">
          {article && (
            <a
              href={`/article/${article.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Article"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-zinc-400 mb-4">
              Featured Image
            </label>
            {formData.imageUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.imageUrl}
                  alt="Featured"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23374151' width='100' height='100'/%3E%3Ctext fill='%239CA3AF' x='50' y='50' text-anchor='middle' dy='.3em' font-size='12'%3EImage failed to load%3C/text%3E%3C/svg%3E"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                  className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center aspect-video bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg">
                <ImageIcon className="w-8 h-8 text-zinc-500 mb-2" />
                <span className="text-sm text-zinc-500 mb-4">Upload featured image</span>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.ufsUrl) {
                      setFormData((prev) => ({ ...prev, imageUrl: res[0].ufsUrl }))
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Upload failed: ${error.message}`)
                  }}
                />
              </div>
            )}
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder="Or enter image URL"
              className="w-full px-4 py-2 mt-4 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content Blocks */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-zinc-400 mb-4">
              Content
            </label>

            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-zinc-500" />
                      <span className="text-xs text-zinc-500 uppercase font-medium">
                        {block.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, "up")}
                        disabled={index === 0}
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, "down")}
                        disabled={index === blocks.length - 1}
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        disabled={blocks.length === 1}
                        className="p-1 text-zinc-500 hover:text-red-400 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content Based on Type */}
                  {block.type === "paragraph" && (
                    <textarea
                      value={block.content || ""}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter paragraph text..."
                    />
                  )}

                  {block.type === "heading" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={block.level || 2}
                          onChange={(e) =>
                            updateBlock(block.id, { level: Number(e.target.value) as 2 | 3 })
                          }
                          className="px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white"
                        >
                          <option value={2}>H2</option>
                          <option value={3}>H3</option>
                        </select>
                        <input
                          type="text"
                          value={block.content || ""}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter heading text..."
                        />
                      </div>
                    </div>
                  )}

                  {block.type === "image" && (
                    <div className="space-y-3">
                      {block.imageUrl ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={block.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23374151' width='100' height='100'/%3E%3Ctext fill='%239CA3AF' x='50' y='50' text-anchor='middle' dy='.3em' font-size='12'%3EImage failed to load%3C/text%3E%3C/svg%3E"
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => updateBlock(block.id, { imageUrl: "" })}
                            className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-48 bg-zinc-900 border-2 border-dashed border-zinc-600 rounded-lg">
                          {uploadingBlockId === block.id ? (
                            <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 text-zinc-500 mb-2" />
                              <span className="text-sm text-zinc-500 mb-3">Upload image</span>
                              <UploadButton
                                endpoint="imageUploader"
                                onUploadBegin={() => setUploadingBlockId(block.id)}
                                onClientUploadComplete={(res) => {
                                  if (res?.[0]?.ufsUrl) {
                                    updateBlock(block.id, { imageUrl: res[0].ufsUrl })
                                  }
                                  setUploadingBlockId(null)
                                }}
                                onUploadError={(error: Error) => {
                                  alert(`Upload failed: ${error.message}`)
                                  setUploadingBlockId(null)
                                }}
                              />
                            </>
                          )}
                        </div>
                      )}
                      <input
                        type="text"
                        value={block.imageUrl || ""}
                        onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white"
                        placeholder="Or enter image URL..."
                      />
                      <input
                        type="text"
                        value={block.imageCaption || ""}
                        onChange={(e) => updateBlock(block.id, { imageCaption: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white"
                        placeholder="Image caption (optional)"
                      />
                    </div>
                  )}

                  {block.type === "quote" && (
                    <div className="space-y-2">
                      <textarea
                        value={block.content || ""}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white italic"
                        placeholder="Enter quote text..."
                      />
                      <input
                        type="text"
                        value={block.attribution || ""}
                        onChange={(e) => updateBlock(block.id, { attribution: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white"
                        placeholder="Attribution (e.g., - John Doe, CEO)"
                      />
                    </div>
                  )}

                  {block.type === "list" && (
                    <div className="space-y-2">
                      {(block.items || [""]).map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-zinc-500">•</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...(block.items || [])]
                              newItems[i] = e.target.value
                              updateBlock(block.id, { items: newItems })
                            }}
                            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white"
                            placeholder="List item..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = (block.items || []).filter((_, idx) => idx !== i)
                              updateBlock(block.id, { items: newItems.length ? newItems : [""] })
                            }}
                            className="p-1 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          updateBlock(block.id, { items: [...(block.items || []), ""] })
                        }}
                        className="text-sm text-blue-500 hover:text-blue-400"
                      >
                        + Add item
                      </button>
                    </div>
                  )}

                  {block.type === "callout" && (
                    <textarea
                      value={block.content || ""}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-md text-white"
                      placeholder="Enter callout text..."
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Add Block Buttons */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-700">
              <button
                type="button"
                onClick={() => addBlock("paragraph")}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700"
              >
                <Type className="w-4 h-4" />
                Paragraph
              </button>
              <button
                type="button"
                onClick={() => addBlock("heading")}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700"
              >
                <Heading2 className="w-4 h-4" />
                Heading
              </button>
              <button
                type="button"
                onClick={() => addBlock("image")}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700"
              >
                <ImageIcon className="w-4 h-4" />
                Image
              </button>
              <button
                type="button"
                onClick={() => addBlock("quote")}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700"
              >
                <Quote className="w-4 h-4" />
                Quote
              </button>
              <button
                type="button"
                onClick={() => addBlock("list")}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700"
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                type="button"
                onClick={() => addBlock("callout")}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700"
              >
                <AlertCircle className="w-4 h-4" />
                Callout
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category & Author */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Markets Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.marketsCategoryId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, marketsCategoryId: e.target.value }))
                }
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                required
              >
                {marketsCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500 mt-1">Which market is this article about?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Business Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.businessCategoryId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, businessCategoryId: e.target.value }))
                }
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                required
              >
                {businessCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500 mt-1">What business sector does this relate to?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Author
              </label>
              <select
                value={formData.authorId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, authorId: e.target.value }))
                }
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Read Time (minutes)
              </label>
              <input
                type="number"
                value={formData.readTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, readTime: Number(e.target.value) }))
                }
                min={1}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              />
            </div>
          </div>

          {/* Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-medium text-zinc-400">Status</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                }
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-white">Featured Article</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBreaking}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isBreaking: e.target.checked }))
                }
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-500"
              />
              <span className="text-white">Breaking News</span>
            </label>
          </div>

          {/* Tags */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    formData.selectedTags.includes(tag.id)
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Relevant Tickers */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Relevant Tickers
            </label>
            <input
              type="text"
              value={formData.relevantTickers}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, relevantTickers: e.target.value }))
              }
              placeholder="AAPL, MSFT, GOOGL"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
            />
            <p className="text-xs text-zinc-500 mt-2">Comma-separated stock symbols</p>
          </div>
        </div>
      </div>
    </form>
  )
}
