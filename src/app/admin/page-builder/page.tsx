"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  LayoutGrid, Plus, Home, FolderOpen, TrendingUp, Settings,
  ChevronRight, Clock, Layers, RefreshCw, Loader2, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PageTypeValue = "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM"

interface PageDefinition {
  id: string; name: string; slug: string; pageType: PageTypeValue; isActive: boolean
  category?: { id: string; name: string; slug: string } | null
  stockSymbol?: string | null; layout?: { id: string; name: string } | null
  zones: Array<{ id: string; zoneDefinition: { name: string; zoneType: string }; placements: Array<{ id: string }> }>
  _count: { zones: number }; updatedAt: string; createdAt: string
}

interface Category { id: string; name: string; slug: string }
interface SyncPreview { discovered: number; existing: number; missing: number; missingPages: Array<{ slug: string; name: string; pageType: string }> }

const pageTypeIcons: Record<PageTypeValue, typeof Home> = { HOMEPAGE: Home, CATEGORY: FolderOpen, STOCK: TrendingUp, CUSTOM: Settings }
const pageTypeColors: Record<PageTypeValue, string> = { HOMEPAGE: "bg-blue-500", CATEGORY: "bg-green-500", STOCK: "bg-purple-500", CUSTOM: "bg-orange-500" }

export default function PageBuilderDashboard() {
  const [pages, setPages] = useState<PageDefinition[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newPage, setNewPage] = useState({ name: "", slug: "", pageType: "CUSTOM" as PageTypeValue, categoryId: "", stockSymbol: "" })
  const [syncOpen, setSyncOpen] = useState(false)
  const [syncPreview, setSyncPreview] = useState<SyncPreview | null>(null)
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => { fetchPages(); fetchCategories() }, [])

  async function fetchPages() {
    try { const res = await fetch("/api/admin/page-builder/pages"); if (res.ok) setPages(await res.json()) }
    catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function fetchCategories() {
    try { const res = await fetch("/api/admin/categories"); if (res.ok) setCategories(await res.json()) } catch (e) { console.error(e) }
  }

  async function fetchSyncPreview() {
    setSyncLoading(true)
    try { const res = await fetch("/api/admin/page-builder/sync"); if (res.ok) setSyncPreview(await res.json()) }
    catch (e) { console.error(e) } finally { setSyncLoading(false) }
  }

  async function syncPages() {
    setSyncing(true)
    try { const res = await fetch("/api/admin/page-builder/sync", { method: "POST" }); if (res.ok) { setSyncOpen(false); setSyncPreview(null); fetchPages() } }
    catch (e) { console.error(e) } finally { setSyncing(false) }
  }

  async function createPage() {
    try {
      const res = await fetch("/api/admin/page-builder/pages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPage.name, slug: newPage.slug, pageType: newPage.pageType,
          categoryId: newPage.pageType === "CATEGORY" ? newPage.categoryId : null,
          stockSymbol: newPage.pageType === "STOCK" ? newPage.stockSymbol : null })
      })
      if (res.ok) { setCreateOpen(false); setNewPage({ name: "", slug: "", pageType: "CUSTOM", categoryId: "", stockSymbol: "" }); fetchPages() }
    } catch (e) { console.error(e) }
  }

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
  const getTotalPlacements = (page: PageDefinition) => page.zones.reduce((acc, zone) => acc + zone.placements.length, 0)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><LayoutGrid className="w-6 h-6" />Page Builder</h1>
          <p className="text-zinc-400 mt-1">Manage page layouts and content placement across your site</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { setSyncOpen(true); fetchSyncPreview() }} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />Sync Pages
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="flex items-center gap-2"><Plus className="w-4 h-4" />New Page</Button></DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader><DialogTitle className="text-white">Create New Page</DialogTitle><DialogDescription>Add a new page configuration.</DialogDescription></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Page Type</Label>
                  <Select value={newPage.pageType} onValueChange={(v: PageTypeValue) => setNewPage({ ...newPage, pageType: v })}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="HOMEPAGE">Homepage</SelectItem><SelectItem value="CATEGORY">Category</SelectItem>
                      <SelectItem value="STOCK">Stock</SelectItem><SelectItem value="CUSTOM">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newPage.pageType === "CATEGORY" && (
                  <div className="space-y-2"><Label>Category</Label>
                    <Select value={newPage.categoryId} onValueChange={(v) => setNewPage({ ...newPage, categoryId: v, name: `Category: ${categories.find(c => c.id === v)?.name || ""}`, slug: `category-${categories.find(c => c.id === v)?.slug || ""}` })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                {newPage.pageType === "STOCK" && (
                  <div className="space-y-2"><Label>Stock Symbol</Label>
                    <Input value={newPage.stockSymbol} onChange={(e) => setNewPage({ ...newPage, stockSymbol: e.target.value.toUpperCase(), name: `Stock: ${e.target.value.toUpperCase()}`, slug: `stock-${e.target.value.toLowerCase()}` })} placeholder="AAPL" className="bg-zinc-800 border-zinc-700" />
                  </div>
                )}
                <div className="space-y-2"><Label>Name</Label><Input value={newPage.name} onChange={(e) => setNewPage({ ...newPage, name: e.target.value, slug: generateSlug(e.target.value) })} className="bg-zinc-800 border-zinc-700" /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })} className="bg-zinc-800 border-zinc-700" /></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={createPage} disabled={!newPage.name || !newPage.slug}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader><DialogTitle className="text-white">Sync Pages</DialogTitle><DialogDescription>Auto-create pages for all categories.</DialogDescription></DialogHeader>
              {syncLoading ? <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-zinc-400" /></div> : syncPreview ? (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-zinc-800 rounded-lg"><div className="text-2xl font-bold text-white">{syncPreview.discovered}</div><div className="text-sm text-zinc-400">Discovered</div></div>
                    <div className="p-4 bg-zinc-800 rounded-lg"><div className="text-2xl font-bold text-green-500">{syncPreview.existing}</div><div className="text-sm text-zinc-400">Existing</div></div>
                    <div className="p-4 bg-zinc-800 rounded-lg"><div className="text-2xl font-bold text-yellow-500">{syncPreview.missing}</div><div className="text-sm text-zinc-400">Missing</div></div>
                  </div>
                  {syncPreview.missing === 0 ? <div className="text-center py-4"><Check className="w-12 h-12 mx-auto mb-2 text-green-500" /><p className="text-zinc-300">All synced!</p></div> : (
                    <div className="max-h-40 overflow-y-auto space-y-1">{syncPreview.missingPages.map(p => <div key={p.slug} className="flex items-center gap-2 text-sm p-2 bg-zinc-800 rounded"><FolderOpen className="w-4 h-4 text-green-500" /><span className="text-white">{p.name}</span><span className="text-zinc-500">/{p.slug}</span></div>)}</div>
                  )}
                </div>
              ) : null}
              <DialogFooter><Button variant="outline" onClick={() => setSyncOpen(false)}>Cancel</Button><Button onClick={syncPages} disabled={syncing || !syncPreview || syncPreview.missing === 0}>{syncing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Syncing...</> : <><RefreshCw className="w-4 h-4 mr-2" />Create {syncPreview?.missing || 0}</>}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Total Pages</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-white">{pages.length}</div></CardContent></Card>
        <Card className="bg-zinc-900 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{pages.filter(p => p.isActive).length}</div></CardContent></Card>
        <Card className="bg-zinc-900 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Zones</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-white">{pages.reduce((a, p) => a + p._count.zones, 0)}</div></CardContent></Card>
        <Card className="bg-zinc-900 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Placements</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-white">{pages.reduce((a, p) => a + getTotalPlacements(p), 0)}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(page => {
          const Icon = pageTypeIcons[page.pageType], color = pageTypeColors[page.pageType]
          return (
            <Link key={page.id} href={`/admin/page-builder/${page.id}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer h-full">
                <CardHeader><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${color}`}><Icon className="w-5 h-5 text-white" /></div><div><CardTitle className="text-white text-lg">{page.name}</CardTitle><CardDescription className="text-zinc-500">/{page.slug}</CardDescription></div></div><Badge variant={page.isActive ? "default" : "secondary"}>{page.isActive ? "Active" : "Inactive"}</Badge></div></CardHeader>
                <CardContent><div className="space-y-3"><div className="flex items-center gap-4 text-sm text-zinc-400"><div className="flex items-center gap-1"><Layers className="w-4 h-4" /><span>{page._count.zones} zones</span></div><div className="flex items-center gap-1"><LayoutGrid className="w-4 h-4" /><span>{getTotalPlacements(page)} placements</span></div></div>{page.category && <div className="text-sm text-zinc-500">Category: <span className="text-zinc-300">{page.category.name}</span></div>}{page.stockSymbol && <div className="text-sm text-zinc-500">Symbol: <span className="text-zinc-300 font-mono">{page.stockSymbol}</span></div>}<div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800"><div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>Updated {formatDate(page.updatedAt)}</span></div><ChevronRight className="w-4 h-4" /></div></div></CardContent>
              </Card>
            </Link>
          )
        })}
        {pages.length === 0 && <Card className="bg-zinc-900 border-zinc-800 col-span-full"><CardContent className="flex flex-col items-center justify-center py-12 text-center"><LayoutGrid className="w-12 h-12 text-zinc-600 mb-4" /><h3 className="text-lg font-medium text-white mb-2">No pages</h3><p className="text-zinc-400 mb-4">Create your first page.</p><Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4 mr-2" />Create</Button></CardContent></Card>}
      </div>
    </div>
  )
}
