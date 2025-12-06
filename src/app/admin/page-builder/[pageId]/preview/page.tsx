"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZoneRenderer } from "@/components/zones";
import type { ZoneContent } from "@/components/zones/types";

interface PageData {
  id: string;
  name: string;
  slug: string;
  pageType: string;
  isActive: boolean;
}

interface ZoneData {
  id: string;
  zoneType: string;
  sortOrder: number;
  isEnabled: boolean;
  zoneDefinition: {
    slug: string;
    zoneType: string;
  } | null;
  content: ZoneContent[];
}

export default function PagePreview() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreviewData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch page data
      const pageRes = await fetch(`/api/admin/page-builder/pages/${pageId}`);
      if (!pageRes.ok) throw new Error("Failed to load page");
      const pageData = await pageRes.json();
      setPage(pageData);

      // Fetch zones with content
      const zonesRes = await fetch(`/api/admin/page-builder/pages/${pageId}/zones`);
      if (!zonesRes.ok) throw new Error("Failed to load zones");
      const zonesData = await zonesRes.json();

      // Fetch content for each zone
      const zonesWithContent = await Promise.all(
        zonesData.map(async (zone: ZoneData) => {
          try {
            const contentRes = await fetch(
              `/api/admin/page-builder/pages/${pageId}/zones/${zone.id}/placements`
            );
            if (contentRes.ok) {
              const placements = await contentRes.json();
              // Transform placements to content
              const content: ZoneContent[] = placements
                .filter((p: { article?: unknown; video?: unknown }) => p.article || p.video)
                .map((p: { article?: ZoneContent; video?: ZoneContent }) => p.article || p.video);
              return { ...zone, content };
            }
          } catch (e) {
            console.error(`Failed to load content for zone ${zone.id}:`, e);
          }
          return { ...zone, content: [] };
        })
      );

      setZones(zonesWithContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviewData();
  }, [pageId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Failed to Load Preview</h2>
            <p className="text-muted-foreground">{error || "Page not found"}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const getLiveUrl = () => {
    switch (page.pageType) {
      case "HOMEPAGE":
        return "/";
      case "CATEGORY":
        return `/category/${page.slug}`;
      case "STOCK":
        return `/stocks/${page.slug}`;
      default:
        return `/${page.slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Toolbar */}
      <div className="sticky top-0 z-50 bg-amber-500 text-amber-950">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/page-builder/${pageId}`}
                className="flex items-center gap-2 text-sm font-medium hover:text-amber-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Editor
              </Link>
              <div className="h-4 w-px bg-amber-600" />
              <span className="text-sm font-semibold">Preview Mode</span>
              <span className="text-sm">- {page.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchPreviewData}
                className="text-amber-950 hover:bg-amber-400"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-amber-950 hover:bg-amber-400"
              >
                <Link href={getLiveUrl()} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="py-8">
        {zones.length === 0 ? (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
              <h3 className="text-lg font-medium text-muted-foreground">No zones configured</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add zones to this page in the editor to see a preview.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {zones
              .filter((zone) => zone.isEnabled)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((zone) => (
                <div key={zone.id} className="relative group">
                  {/* Zone Label */}
                  <div className="absolute -top-3 left-4 z-10 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {zone.zoneDefinition?.slug || zone.id} ({zone.zoneDefinition?.zoneType || "CUSTOM"})
                  </div>

                  {/* Zone Outline */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-lg pointer-events-none transition-colors" />

                  {/* Zone Content */}
                  <ZoneRenderer
                    zoneType={zone.zoneDefinition?.zoneType || "CUSTOM"}
                    content={zone.content}
                    fallback={
                      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-muted/50 p-8 text-center">
                          <p className="text-sm text-muted-foreground">
                            Zone: {zone.zoneDefinition?.slug || zone.id}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            No content or unsupported zone type
                          </p>
                        </div>
                      </div>
                    }
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
