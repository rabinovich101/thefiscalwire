"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  LayoutGrid,
  Plus,
  Home,
  FolderOpen,
  TrendingUp,
  Settings,
  ChevronRight,
  Clock,
  Layers,
  RefreshCw,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PageTypeValue = "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM"

interface PageDefinition {
  id: string
  name: string
  slug: string
  pageType: PageTypeValue
  isActive: boolean
  category?: { id: string; name: string; slug: string } | null
  stockSymbol?: string | null
  layout?: { id: string; name: string } | null
  zones: Array<{
    id: string
    zoneDefinition: { name: string; zoneType: string }
    placements: Array<{ id: string }>
  }>
  _count: { zones: number }
  updatedAt: string
  createdAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

const pageTypeIcons: Record<PageTypeValue, typeof Home> = {
  HOMEPAGE: Home,
  CATEGORY: FolderOpen,
  STOCK: TrendingUp,
  CUSTOM: Settings,
}

const pageTypeColors: Record<PageTypeValue, string> = {
  HOMEPAGE: "bg-blue-500",
  CATEGORY: "bg-green-500",
  STOCK: "bg-purple-500",
  CUSTOM: "bg-orange-500",
}

export default function PageBuilderDashboard() {
  const [pages, setPages] = useState<PageDefinition[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newPage, setNewPage] = useState({
    name: "",
    slug: "",
    pageType: "CUSTOM" as PageTypeValue,
    categoryId: "",
    stockSymbol: "",
  })
  const [syncOpen, setSyncOpen] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{
    discovered: number
    existing: number
    missing: number
  } | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ created: number; pages: string[] } | null>(null)

  useEffect(() => {
    fetchPages()
    fetchCategories()
  }, [])

  async function fetchPages() {
    try {
      const res = await fetch("/api/admin/page-builder/pages")
      if (res.ok) {
        const data = await res.json()
        setPages(data)
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error)
    } finally {
      setLoading(false)
    }
  }

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

  async function fetchSyncStatus() {
    try {
      const res = await fetch("/api/admin/page-builder/sync")
      if (res.ok) {
        const data = await res.json()
        setSyncStatus(data)
      }
    } catch (error) {
      console.error("Failed to fetch sync status:", error)
    }
  }

  async function handleSync() {
    setSyncing(true)
    setSyncResult(null)
    try {
      const res = await fetch("/api/admin/page-builder/sync", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        setSyncResult(data)
        fetchPages()
        fetchSyncStatus()
      }
    } catch (error) {
      console.error("Failed to sync pages:", error)
    } finally {
      setSyncing(false)
    }
  }

  function openSyncDialog() {
    setSyncResult(null)
    fetchSyncStatus()
    setSyncOpen(true)
  }

  async function createPage() {
    try {
      const res = await fetch("/api/admin/page-builder/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPage.name,
          slug: newPage.slug,
          pageType: newPage.pageType,
          categoryId: newPage.pageType === "CATEGORY" ? newPage.categoryId : null,
          stockSymbol: newPage.pageType === "STOCK" ? newPage.stockSymbol : null,
        }),
      })

      if (res.ok) {
        setCreateOpen(false)
        setNewPage({ name: "", slug: "", pageType: "CUSTOM", categoryId: "", stockSymbol: "" })
        fetchPages()
      }
    } catch (error) {
      console.error("Failed to create page:", error)
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function getTotalPlacements(page: PageDefinition) {
    return page.zones.reduce((acc, zone) => acc + zone.placements.length, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-6 h-6" />
            Page Builder
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage page layouts and content placement across your site
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={openSyncDialog} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Pages
          </Button>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Page
              </Button>
            </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Page</DialogTitle>
              <DialogDescription>
                Add a new page configuration to manage its content zones.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Page Type</Label>
                <Select
                  value={newPage.pageType}
                  onValueChange={(value: PageTypeValue) =>
                    setNewPage({ ...newPage, pageType: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="HOMEPAGE">Homepage</SelectItem>
                    <SelectItem value="CATEGORY">Category Page</SelectItem>
                    <SelectItem value="STOCK">Stock Page</SelectItem>
                    <SelectItem value="CUSTOM">Custom Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newPage.pageType === "CATEGORY" && (
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newPage.categoryId}
                    onValueChange={(value) =>
                      setNewPage({
                        ...newPage,
                        categoryId: value,
                        name: `Category: ${categories.find((c) => c.id === value)?.name || ""}`,
                        slug: `category-${categories.find((c) => c.id === value)?.slug || ""}`,
                      })
                    }
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newPage.pageType === "STOCK" && (
                <div className="space-y-2">
                  <Label>Stock Symbol</Label>
                  <Input
                    value={newPage.stockSymbol}
                    onChange={(e) =>
                      setNewPage({
                        ...newPage,
                        stockSymbol: e.target.value.toUpperCase(),
                        name: `Stock: ${e.target.value.toUpperCase()}`,
                        slug: `stock-${e.target.value.toLowerCase()}`,
                      })
                    }
                    placeholder="e.g., AAPL, GOOGL"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Page Name</Label>
                <Input
                  value={newPage.name}
                  onChange={(e) =>
                    setNewPage({
                      ...newPage,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  placeholder="e.g., Homepage, US Markets Category"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  placeholder="e.g., homepage, us-markets"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createPage} disabled={!newPage.name || !newPage.slug}>
                Create Page
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>

        {/* Sync Dialog */}
        <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Sync Pages</DialogTitle>
              <DialogDescription>
                Auto-discover and create missing page configurations from your database content.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              {syncStatus && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{syncStatus.discovered}</div>
                    <div className="text-xs text-zinc-400">Discovered</div>
                  </div>
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{syncStatus.existing}</div>
                    <div className="text-xs text-zinc-400">Existing</div>
                  </div>
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{syncStatus.missing}</div>
                    <div className="text-xs text-zinc-400">Missing</div>
                  </div>
                </div>
              )}

              {syncResult && (
                <div className="p-3 bg-green-900/30 border border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 font-medium mb-2">
                    <Check className="w-4 h-4" />
                    Created {syncResult.created} pages
                  </div>
                  {syncResult.pages.length > 0 && (
                    <div className="text-sm text-zinc-400 space-y-1">
                      {syncResult.pages.map((name, i) => (
                        <div key={i}>• {name}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSyncOpen(false)}>
                Close
              </Button>
              <Button
                onClick={handleSync}
                disabled={syncing || !syncStatus || syncStatus.missing === 0}
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync {syncStatus?.missing || 0} Pages
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pages.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {pages.filter((p) => p.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pages.reduce((acc, p) => acc + p._count.zones, 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pages.reduce((acc, p) => acc + getTotalPlacements(p), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => {
          const Icon = pageTypeIcons[page.pageType]
          const color = pageTypeColors[page.pageType]

          return (
            <Link key={page.id} href={`/admin/page-builder/${page.id}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{page.name}</CardTitle>
                        <CardDescription className="text-zinc-500">/{page.slug}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={page.isActive ? "default" : "secondary"}>
                      {page.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Layers className="w-4 h-4" />
                        <span>{page._count.zones} zones</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LayoutGrid className="w-4 h-4" />
                        <span>{getTotalPlacements(page)} placements</span>
                      </div>
                    </div>

                    {page.category && (
                      <div className="text-sm text-zinc-500">
                        Category: <span className="text-zinc-300">{page.category.name}</span>
                      </div>
                    )}

                    {page.stockSymbol && (
                      <div className="text-sm text-zinc-500">
                        Symbol: <span className="text-zinc-300 font-mono">{page.stockSymbol}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated {formatDate(page.updatedAt)}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {pages.length === 0 && (
          <Card className="bg-zinc-900 border-zinc-800 col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <LayoutGrid className="w-12 h-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No pages configured</h3>
              <p className="text-zinc-400 mb-4">
                Create your first page configuration to start managing content placement.
              </p>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Page
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
