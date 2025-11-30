import Link from "next/link";
import Image from "next/image";
import { Play, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { categoryColors } from "@/lib/data";
import type { Video as VideoType } from "@/lib/data";

interface VideoCarouselProps {
  videos: VideoType[];
}

export function VideoCarousel({ videos }: VideoCarouselProps) {
  return (
    <section className="py-8 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-6">
          <Video className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Latest Videos</h2>
        </div>

        {/* Video Carousel */}
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/video/${video.id}`}
                className="group relative flex-shrink-0 w-[280px] sm:w-[320px]"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/90 text-white">
                      <Play className="h-6 w-6 ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/80 text-white text-xs font-medium border-0"
                    >
                      {video.duration}
                    </Badge>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-semibold uppercase ${categoryColors[video.category as keyof typeof categoryColors] || "bg-gray-600"} text-white border-0`}
                    >
                      {video.category}
                    </Badge>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
