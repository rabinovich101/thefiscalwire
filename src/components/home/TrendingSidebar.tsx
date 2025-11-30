import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TrendingItem } from "@/lib/data";

interface TrendingSidebarProps {
  stories: TrendingItem[];
}

export function TrendingSidebar({ stories }: TrendingSidebarProps) {
  return (
    <div className="rounded-xl bg-surface border border-border/40 p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Trending Now</h2>
      </div>

      {/* Trending List */}
      <div className="space-y-0">
        {stories.map((story) => (
          <Link
            key={story.rank}
            href={story.url}
            className="group flex items-start gap-3 py-3 border-b border-border/40 last:border-0"
          >
            {/* Rank Number */}
            <span className="text-2xl font-bold text-muted-foreground/50 tabular-nums w-6 shrink-0">
              {story.rank}
            </span>

            {/* Content */}
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {story.title}
              </h3>
              <Badge
                variant="outline"
                className="w-fit mt-1.5 text-[10px] font-medium text-muted-foreground border-border/40"
              >
                {story.category}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
