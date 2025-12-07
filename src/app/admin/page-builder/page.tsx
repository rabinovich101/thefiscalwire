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
  Loader2,
  Globe
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

interface SyncStatus {
  discovered: number
  existing: number
  missing: number
  missingPages: Array<{ name: string; slug: string }>
}

interface PageDefinition {
  id: string
  name: string
  slug: string
  pageType: "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM" | "STATIC" | "MARKETS"
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

const pageTypeIcons = {
  HOMEPAGE: Home,
  CATEGORY: FolderOpen,
  STOCK: TrendingUp,
  CUSTOM: Settings,
  STATIC: Globe,
  MARKETS: TrendingUp,
}

const pageTypeColors = {
  HOMEPAGE: "bg-blue-500",
  CATEGORY: "bg-green-500",
  STOCK: "bg-purple-500",
  CUSTOM: "bg-orange-500",
  STATIC: "bg-gray-500",
  MARKETS: "bg-indigo-500",
}

export default function PageBuilderDashboard() {
  const [pages, setPages] = useState<PageDefinition[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newPage, setNewPage] = useState({
    name: "",
    slug: "",
    pageType: "CUSTOM" as "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM" | "STATIC" | "MARKETS",
    categoryId: "",
    stockSymbol: "",
  })
  const [syncOpen, setSyncOpen] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)

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
    setSyncLoading(true)
    try {
      const res = await fetch("/api/admin/page-builder/sync")
      if (res.ok) {
        const data = await res.json()
        setSyncStatus(data)
      }
    } catch (error) {
      console.error("Failed to fetch sync status:", error)
    } finally {
      setSyncLoading(false)
    }
  }

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await fetch("/api/admin/page-builder/sync", {
        method: "POST",
      })
      if (res.ok) {
        setSyncOpen(false)
        setSyncStatus(null)
        fetchPages()
      }
    } catch (error) {
      console.error("Failed to sync pages:", error)
    } finally {
      setSyncing(false)
    }
  }

  function openSyncDialog() {
    setSyncOpen(true)
    fetchSyncStatus()
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
          <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" onClick={openSyncDialog}>
                <RefreshCw className="w-4 h-4" />
                Sync Pages
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">Sync Pages</DialogTitle>
                <DialogDescription>
                  Automatically discover and create pages from your database content.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {syncLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                  </div>
                ) : syncStatus ? (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-zinc-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{syncStatus.discovered}</div>
                        <div className="text-sm text-zinc-400">Discovered</div>
                      </div>
                      <div className="bg-zinc-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-500">{syncStatus.existing}</div>
                        <div className="text-sm text-zinc-400">Existing</div>
                      </div>
                      <div className="bg-zinc-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-500">{syncStatus.missing}</div>
                        <div className="text-sm text-zinc-400">Missing</div>
                      </div>
                    </div>

                    {syncStatus.missing > 0 && (
                      <div className="bg-zinc-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-white mb-2">Pages to be created:</h4>
                        <ul className="space-y-1 max-h-40 overflow-y-auto">
                          {syncStatus.missingPages.map((page, i) => (
                            <li key={i} className="text-sm text-zinc-400">
                              {page.name} <span className="text-zinc-600">({page.slug})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {syncStatus.missing === 0 && (
                      <div className="text-center py-4 text-green-500">
                        All pages are synced!
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSyncOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSync}
                  disabled={syncing || !syncStatus || syncStatus.missing === 0}
                >
                  {syncing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                  onValueChange={(value: "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM") =>
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
