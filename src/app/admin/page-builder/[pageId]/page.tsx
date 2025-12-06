"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  Plus,
  GripVertical,
  Pin,
  PinOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  FileText,
  Video,
  Image,
  Zap,
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
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AutoFillRuleEditor } from "@/components/admin/page-builder/AutoFillRuleEditor"
import { toast } from "sonner"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl: string
  publishedAt: string
  category: { id: string; name: string; slug: string; color: string } | null
  author?: { id: string; name: string; avatar: string | null } | null
}

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  duration: string
  category: string
  createdAt: string
}

interface Placement {
  id: string
  contentType: "ARTICLE" | "VIDEO" | "CUSTOM" | "AUTO"
  position: number
  isPinned: boolean
  startDate: string | null
  endDate: string | null
  article: Article | null
  video: VideoItem | null
  customContent: Record<string, unknown> | null
}

interface Zone {
  id: string
  customName: string | null
  isEnabled: boolean
  sortOrder: number
  autoFillRules: Record<string, unknown> | null
  zoneDefinition: {
    id: string
    name: string
    slug: string
    description: string | null
    zoneType: string
    minItems: number
    maxItems: number
    defaultRules: Record<string, unknown> | null
  }
  placements: Placement[]
}

interface PageData {
  id: string
  name: string
  slug: string
  pageType: string
  isActive: boolean
  category: { id: string; name: string; slug: string } | null
  stockSymbol: string | null
  layout: { id: string; name: string } | null
  zones: Zone[]
}

interface ZoneDefinition {
  id: string
  name: string
  slug: string
  description: string | null
  zoneType: string
}

// Sortable Placement Component
function SortablePlacement({
  placement,
  onTogglePin,
  onRemove,
}: {
  placement: Placement
  onTogglePin: (id: string) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: placement.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const content = placement.article || placement.video

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700 ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-zinc-500 hover:text-zinc-300 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {placement.contentType === "ARTICLE" && placement.article && (
        <>
          <div className="w-16 h-10 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
            {placement.article.imageUrl && (
              <img
                src={placement.article.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{placement.article.title}</p>
            <p className="text-xs text-zinc-500">
              {placement.article.category?.name || "No category"}
            </p>
          </div>
        </>
      )}

      {placement.contentType === "VIDEO" && placement.video && (
        <>
          <div className="w-16 h-10 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
            {placement.video.thumbnail && (
              <img
                src={placement.video.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{placement.video.title}</p>
            <p className="text-xs text-zinc-500">Video • {placement.video.duration}</p>
          </div>
        </>
      )}

      {placement.contentType === "CUSTOM" && (
        <div className="flex-1">
          <p className="text-sm text-white">Custom Content</p>
          <p className="text-xs text-zinc-500">Custom HTML/Widget</p>
        </div>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onTogglePin(placement.id)}
          title={placement.isPinned ? "Unpin" : "Pin"}
        >
          {placement.isPinned ? (
            <Pin className="w-4 h-4 text-blue-500" />
          ) : (
            <PinOff className="w-4 h-4 text-zinc-500" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-400"
          onClick={() => onRemove(placement.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
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

// Zone Card Component
function ZoneCard({
  zone,
  pageId,
  onToggleEnabled,
  onAddContent,
  onReorderPlacements,
  onTogglePin,
  onRemovePlacement,
  onUpdateAutoFill,
  expanded,
  onToggleExpand,
}: {
  zone: Zone
  pageId: string
  onToggleEnabled: (zoneId: string, enabled: boolean) => void
  onAddContent: (zoneId: string) => void
  onReorderPlacements: (zoneId: string, placementIds: string[]) => void
  onTogglePin: (zoneId: string, placementId: string) => void
  onRemovePlacement: (zoneId: string, placementId: string) => void
  onUpdateAutoFill: (zoneId: string, config: AutoFillConfig | null) => void
  expanded: boolean
  onToggleExpand: () => void
}) {
  const [activeTab, setActiveTab] = useState<"content" | "autofill">("content")
  const [autoFillConfig, setAutoFillConfig] = useState<AutoFillConfig>(
    (zone.autoFillRules as unknown as AutoFillConfig) || { source: "articles", limit: 10 }
  )
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = zone.placements.findIndex((p) => p.id === active.id)
      const newIndex = zone.placements.findIndex((p) => p.id === over.id)
      const newOrder = arrayMove(zone.placements, oldIndex, newIndex)
      onReorderPlacements(
        zone.id,
        newOrder.map((p) => p.id)
      )
    }
  }

  const zoneTypeColors: Record<string, string> = {
    HERO_FEATURED: "bg-purple-500",
    HERO_SECONDARY: "bg-purple-400",
    ARTICLE_GRID: "bg-blue-500",
    ARTICLE_LIST: "bg-blue-400",
    TRENDING_SIDEBAR: "bg-orange-500",
    BREAKING_BANNER: "bg-red-500",
    MARKET_TICKER: "bg-green-500",
    MARKET_MOVERS: "bg-green-400",
    VIDEO_CAROUSEL: "bg-pink-500",
    CATEGORY_NAV: "bg-cyan-500",
    CUSTOM_HTML: "bg-gray-500",
    STOCK_CHART: "bg-indigo-500",
    STOCK_NEWS: "bg-indigo-400",
  }

  return (
    <Card className={`bg-zinc-900 border-zinc-800 ${!zone.isEnabled ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                zoneTypeColors[zone.zoneDefinition.zoneType] || "bg-gray-500"
              }`}
            />
            <div>
              <CardTitle className="text-white text-base">
                {zone.customName || zone.zoneDefinition.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {zone.zoneDefinition.zoneType} • {zone.placements.length}/
                {zone.zoneDefinition.maxItems} items
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={zone.isEnabled}
              onCheckedChange={(checked: boolean) => onToggleEnabled(zone.id, checked)}
            />
            <Button variant="ghost" size="icon" onClick={onToggleExpand}>
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as "content" | "autofill")}>
            <TabsList className="bg-zinc-800 mb-4">
              <TabsTrigger value="content" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Manual Content
              </TabsTrigger>
              <TabsTrigger value="autofill" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Auto-Fill
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-0">
              <div className="space-y-3">
                {zone.placements.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={zone.placements.map((p) => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {zone.placements.map((placement) => (
                          <SortablePlacement
                            key={placement.id}
                            placement={placement}
                            onTogglePin={(id) => onTogglePin(zone.id, id)}
                            onRemove={(id) => onRemovePlacement(zone.id, id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-4 text-zinc-500 text-sm">
                    No content placed yet
                  </div>
                )}

                {zone.placements.length < zone.zoneDefinition.maxItems && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onAddContent(zone.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="autofill" className="mt-0">
              <div className="space-y-4">
                <p className="text-sm text-zinc-400">
                  Configure auto-fill rules to automatically populate this zone with matching content.
                  Auto-filled content appears after manually placed items.
                </p>
                <AutoFillRuleEditor
                  config={autoFillConfig}
                  onChange={setAutoFillConfig}
                  onSave={() => onUpdateAutoFill(zone.id, autoFillConfig)}
                  showActions={true}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}

export default function PageEditor({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = use(params)
  const router = useRouter()
  const [page, setPage] = useState<PageData | null>(null)
  const [zoneDefinitions, setZoneDefinitions] = useState<ZoneDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [contentPickerOpen, setContentPickerOpen] = useState(false)
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    articles?: Article[]
    videos?: VideoItem[]
  }>({})
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    fetchPage()
    fetchZoneDefinitions()
  }, [pageId])

  async function fetchPage() {
    try {
      const res = await fetch(`/api/admin/page-builder/pages/${pageId}`)
      if (res.ok) {
        const data = await res.json()
        setPage(data)
        // Expand all zones by default
        setExpandedZones(new Set(data.zones.map((z: Zone) => z.id)))
      }
    } catch (error) {
      console.error("Failed to fetch page:", error)
      toast.error("Failed to load page")
    } finally {
      setLoading(false)
    }
  }

  async function fetchZoneDefinitions() {
    try {
      const res = await fetch("/api/admin/page-builder/zone-definitions")
      if (res.ok) {
        const data = await res.json()
        setZoneDefinitions(data)
      }
    } catch (error) {
      console.error("Failed to fetch zone definitions:", error)
    }
  }

  async function toggleZoneEnabled(zoneId: string, enabled: boolean) {
    try {
      await fetch(`/api/admin/page-builder/pages/${pageId}/zones/${zoneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: enabled }),
      })
      fetchPage()
      toast.success(enabled ? "Zone enabled" : "Zone disabled")
    } catch (error) {
      console.error("Failed to toggle zone:", error)
      toast.error("Failed to update zone")
    }
  }

  async function reorderPlacements(zoneId: string, placementIds: string[]) {
    try {
      await fetch(`/api/admin/page-builder/pages/${pageId}/zones/${zoneId}/placements/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placementIds }),
      })
      // Optimistic update
      if (page) {
        setPage({
          ...page,
          zones: page.zones.map((z) => {
            if (z.id === zoneId) {
              const newPlacements = placementIds.map((id, index) => {
                const placement = z.placements.find((p) => p.id === id)!
                return { ...placement, position: index }
              })
              return { ...z, placements: newPlacements }
            }
            return z
          }),
        })
      }
    } catch (error) {
      console.error("Failed to reorder placements:", error)
      toast.error("Failed to reorder content")
      fetchPage()
    }
  }

  async function togglePin(zoneId: string, placementId: string) {
    const zone = page?.zones.find((z) => z.id === zoneId)
    const placement = zone?.placements.find((p) => p.id === placementId)
    if (!placement) return

    try {
      await fetch(
        `/api/admin/page-builder/pages/${pageId}/zones/${zoneId}/placements/${placementId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPinned: !placement.isPinned }),
        }
      )
      fetchPage()
      toast.success(placement.isPinned ? "Content unpinned" : "Content pinned")
    } catch (error) {
      console.error("Failed to toggle pin:", error)
      toast.error("Failed to update pin status")
    }
  }

  async function removePlacement(zoneId: string, placementId: string) {
    try {
      await fetch(
        `/api/admin/page-builder/pages/${pageId}/zones/${zoneId}/placements/${placementId}`,
        {
          method: "DELETE",
        }
      )
      fetchPage()
      toast.success("Content removed")
    } catch (error) {
      console.error("Failed to remove placement:", error)
      toast.error("Failed to remove content")
    }
  }

  async function updateAutoFill(zoneId: string, config: AutoFillConfig | null) {
    try {
      await fetch(`/api/admin/page-builder/pages/${pageId}/zones/${zoneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoFillRules: config }),
      })
      fetchPage()
      toast.success("Auto-fill rules updated")
    } catch (error) {
      console.error("Failed to update auto-fill rules:", error)
      toast.error("Failed to update auto-fill rules")
    }
  }

  async function searchContent(query: string) {
    setSearchLoading(true)
    try {
      const res = await fetch(
        `/api/admin/page-builder/content-search?q=${encodeURIComponent(query)}&type=all&limit=20`
      )
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error("Failed to search content:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  async function addPlacement(zoneId: string, contentType: "ARTICLE" | "VIDEO", contentId: string) {
    try {
      await fetch(`/api/admin/page-builder/pages/${pageId}/zones/${zoneId}/placements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          articleId: contentType === "ARTICLE" ? contentId : undefined,
          videoId: contentType === "VIDEO" ? contentId : undefined,
        }),
      })
      setContentPickerOpen(false)
      setSelectedZoneId(null)
      setSearchQuery("")
      setSearchResults({})
      fetchPage()
      toast.success("Content added to zone")
    } catch (error) {
      console.error("Failed to add placement:", error)
      toast.error("Failed to add content")
    }
  }

  function openContentPicker(zoneId: string) {
    setSelectedZoneId(zoneId)
    setContentPickerOpen(true)
    searchContent("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Page not found</p>
        <Link href="/admin/page-builder">
          <Button variant="link">Back to Page Builder</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/page-builder">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{page.name}</h1>
            <p className="text-zinc-400 text-sm">/{page.slug}</p>
          </div>
          <Badge variant={page.isActive ? "default" : "secondary"}>
            {page.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setSettingsOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Link href={`/admin/page-builder/${pageId}/preview`}>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button disabled={saving} onClick={() => router.push("/admin/page-builder")}>
            <Save className="w-4 h-4 mr-2" />
            Done
          </Button>
        </div>
      </div>

      {/* Zones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Page Zones</h2>
          <p className="text-sm text-zinc-400">{page.zones.length} zones configured</p>
        </div>

        <div className="grid gap-4">
          {page.zones
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                pageId={pageId}
                onToggleEnabled={toggleZoneEnabled}
                onAddContent={openContentPicker}
                onReorderPlacements={reorderPlacements}
                onTogglePin={togglePin}
                onRemovePlacement={removePlacement}
                onUpdateAutoFill={updateAutoFill}
                expanded={expandedZones.has(zone.id)}
                onToggleExpand={() => {
                  const newExpanded = new Set(expandedZones)
                  if (newExpanded.has(zone.id)) {
                    newExpanded.delete(zone.id)
                  } else {
                    newExpanded.add(zone.id)
                  }
                  setExpandedZones(newExpanded)
                }}
              />
            ))}

          {page.zones.length === 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="py-12 text-center">
                <p className="text-zinc-400">No zones configured for this page.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Settings Sheet */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent className="bg-zinc-900 border-zinc-800">
          <SheetHeader>
            <SheetTitle className="text-white">Page Settings</SheetTitle>
            <SheetDescription>Configure page settings and layout options.</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label>Page Name</Label>
              <Input value={page.name} disabled className="bg-zinc-800 border-zinc-700" />
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={page.slug} disabled className="bg-zinc-800 border-zinc-700" />
            </div>

            <div className="space-y-2">
              <Label>Page Type</Label>
              <Input value={page.pageType} disabled className="bg-zinc-800 border-zinc-700" />
            </div>

            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={page.isActive} disabled />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Content Picker Dialog */}
      <Dialog open={contentPickerOpen} onOpenChange={setContentPickerOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Content</DialogTitle>
            <DialogDescription>Search and select content to add to this zone.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchContent(e.target.value)
                }}
                placeholder="Search articles and videos..."
                className="pl-9 bg-zinc-800 border-zinc-700"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    searchContent("")
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Tabs defaultValue="articles">
              <TabsList className="bg-zinc-800">
                <TabsTrigger value="articles">
                  <FileText className="w-4 h-4 mr-2" />
                  Articles ({searchResults.articles?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="videos">
                  <Video className="w-4 h-4 mr-2" />
                  Videos ({searchResults.videos?.length || 0})
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] mt-4">
                <TabsContent value="articles" className="m-0">
                  {searchLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.articles?.map((article) => (
                        <button
                          key={article.id}
                          onClick={() =>
                            selectedZoneId && addPlacement(selectedZoneId, "ARTICLE", article.id)
                          }
                          className="w-full flex items-center gap-3 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-left"
                        >
                          <div className="w-16 h-10 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                            {article.imageUrl && (
                              <img
                                src={article.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{article.title}</p>
                            <p className="text-xs text-zinc-500">
                              {article.category?.name || "No category"} •{" "}
                              {new Date(article.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </button>
                      ))}
                      {searchResults.articles?.length === 0 && (
                        <p className="text-center text-zinc-500 py-8">No articles found</p>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="videos" className="m-0">
                  {searchLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.videos?.map((video) => (
                        <button
                          key={video.id}
                          onClick={() =>
                            selectedZoneId && addPlacement(selectedZoneId, "VIDEO", video.id)
                          }
                          className="w-full flex items-center gap-3 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-left"
                        >
                          <div className="w-16 h-10 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                            {video.thumbnail && (
                              <img
                                src={video.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{video.title}</p>
                            <p className="text-xs text-zinc-500">
                              {video.category} • {video.duration}
                            </p>
                          </div>
                        </button>
                      ))}
                      {searchResults.videos?.length === 0 && (
                        <p className="text-center text-zinc-500 py-8">No videos found</p>
                      )}
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
