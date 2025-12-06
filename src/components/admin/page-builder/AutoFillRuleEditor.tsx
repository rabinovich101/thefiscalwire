"use client"

import { useState, useEffect } from "react"
import {
  Zap,
  Filter,
  SortAsc,
  Hash,
  Calendar,
  Star,
  AlertTriangle,
  Tag,
  Eye,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface Category {
  id: string
  name: string
  slug: string
}

interface AutoFillConfig {
  source: "articles" | "videos"
  filters?: {
    categorySlug?: string
    categoryId?: string
    isFeatured?: boolean
    isBreaking?: boolean
    tags?: string[]
    maxAge?: "24h" | "7d" | "30d" | ""
  }
  sort?: "publishedAt" | "createdAt" | "title"
  order?: "asc" | "desc"
  limit?: number
  skip?: number
}

interface PreviewItem {
  id: string
  title: string
  slug?: string
  excerpt?: string
  imageUrl?: string
  thumbnail?: string
  publishedAt?: string
  createdAt?: string
  category?: { name: string; slug: string; color: string }
  author?: { name: string }
}

interface PreviewResult {
  source: string
  count: number
  items: PreviewItem[]
}

interface AutoFillRuleEditorProps {
  config: AutoFillConfig
  onChange: (config: AutoFillConfig) => void
  onSave?: () => void
  onCancel?: () => void
  showActions?: boolean
}

export function AutoFillRuleEditor({
  config,
  onChange,
  onSave,
  onCancel,
  showActions = true,
}: AutoFillRuleEditorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [preview, setPreview] = useState<PreviewResult | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  async function fetchPreview() {
    setPreviewLoading(true)
    setPreviewOpen(true)
    try {
      const res = await fetch("/api/admin/page-builder/auto-fill-rules/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      })
      if (res.ok) {
        const data = await res.json()
        setPreview(data)
      }
    } catch (error) {
      console.error("Failed to fetch preview:", error)
    } finally {
      setPreviewLoading(false)
    }
  }

  function updateConfig(updates: Partial<AutoFillConfig>) {
    onChange({ ...config, ...updates })
  }

  function updateFilters(updates: Partial<NonNullable<AutoFillConfig["filters"]>>) {
    onChange({
      ...config,
      filters: { ...config.filters, ...updates },
    })
  }

  function addTag() {
    if (!tagInput.trim()) return
    const currentTags = config.filters?.tags || []
    if (!currentTags.includes(tagInput.trim())) {
      updateFilters({ tags: [...currentTags, tagInput.trim()] })
    }
    setTagInput("")
  }

  function removeTag(tag: string) {
    const currentTags = config.filters?.tags || []
    updateFilters({ tags: currentTags.filter((t) => t !== tag) })
  }

  return (
    <div className="space-y-4">
      {/* Source Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Content Source
        </Label>
        <Select
          value={config.source}
          onValueChange={(value: "articles" | "videos") =>
            updateConfig({ source: value })
          }
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="articles">Articles</SelectItem>
            <SelectItem value="videos">Videos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters Section */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between text-zinc-300 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </span>
            {filtersOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          {/* Category Filter */}
          {config.source === "articles" && (
            <div className="space-y-2">
              <Label className="text-sm text-zinc-400">Category</Label>
              <Select
                value={config.filters?.categoryId || ""}
                onValueChange={(value) =>
                  updateFilters({
                    categoryId: value || undefined,
                    categorySlug: categories.find((c) => c.id === value)?.slug,
                  })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="">Any category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Featured/Breaking Filters */}
          {config.source === "articles" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                <Label className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Featured Only
                </Label>
                <Switch
                  checked={config.filters?.isFeatured || false}
                  onCheckedChange={(checked: boolean) =>
                    updateFilters({ isFeatured: checked || undefined })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                <Label className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Breaking Only
                </Label>
                <Switch
                  checked={config.filters?.isBreaking || false}
                  onCheckedChange={(checked: boolean) =>
                    updateFilters({ isBreaking: checked || undefined })
                  }
                />
              </div>
            </div>
          )}

          {/* Max Age Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar className="w-4 h-4" />
              Maximum Age
            </Label>
            <Select
              value={config.filters?.maxAge || ""}
              onValueChange={(value: "24h" | "7d" | "30d" | "") =>
                updateFilters({ maxAge: value || undefined })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="">Any time</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags Filter */}
          {config.source === "articles" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-zinc-400">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add tag..."
                  className="bg-zinc-800 border-zinc-700"
                />
                <Button variant="secondary" onClick={addTag}>
                  Add
                </Button>
              </div>
              {config.filters?.tags && config.filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {config.filters.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Sort Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm text-zinc-400">
            <SortAsc className="w-4 h-4" />
            Sort By
          </Label>
          <Select
            value={config.sort || "publishedAt"}
            onValueChange={(value: "publishedAt" | "createdAt" | "title") =>
              updateConfig({ sort: value })
            }
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="publishedAt">Published Date</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-zinc-400">Order</Label>
          <Select
            value={config.order || "desc"}
            onValueChange={(value: "asc" | "desc") =>
              updateConfig({ order: value })
            }
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Limit and Skip */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm text-zinc-400">
            <Hash className="w-4 h-4" />
            Limit
          </Label>
          <Input
            type="number"
            min={1}
            max={50}
            value={config.limit || 10}
            onChange={(e) =>
              updateConfig({ limit: parseInt(e.target.value) || 10 })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-zinc-400">Skip</Label>
          <Input
            type="number"
            min={0}
            value={config.skip || 0}
            onChange={(e) =>
              updateConfig({ skip: parseInt(e.target.value) || 0 })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
      </div>

      {/* Preview Button */}
      <Button
        variant="outline"
        onClick={fetchPreview}
        disabled={previewLoading}
        className="w-full"
      >
        {previewLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Eye className="w-4 h-4 mr-2" />
        )}
        Preview Results
      </Button>

      {/* Preview Results */}
      {previewOpen && preview && (
        <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white flex items-center justify-between">
                <span>Preview Results ({preview.count} items)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {preview.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 bg-zinc-900 rounded-lg"
                  >
                    {(item.imageUrl || item.thumbnail) && (
                      <img
                        src={item.imageUrl || item.thumbnail}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        {item.category && (
                          <span
                            className="px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: item.category.color }}
                          >
                            {item.category.name}
                          </span>
                        )}
                        {item.publishedAt && (
                          <span>
                            {new Date(item.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {preview.items.length === 0 && (
                  <p className="text-sm text-zinc-500 text-center py-4">
                    No matching content found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </Collapsible>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-zinc-800">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Rule
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
