import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { ZoneProps, isVideo, ZoneVideo } from "./types"

interface VideoCardProps {
  video: ZoneVideo
}

function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="group flex flex-col shrink-0 w-64"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="h-5 w-5 text-black fill-black ml-0.5" />
          </div>
        </div>
        {/* Duration Badge */}
        {video.duration && video.duration !== "0:00" && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {video.title}
      </h3>
      <span className="mt-1 text-xs text-muted-foreground">{video.category}</span>
    </Link>
  )
}

export function VideoCarouselZone({ content, className }: ZoneProps) {
  const videos = content.filter(isVideo)

  if (videos.length === 0) {
    return null
  }

  return (
    <div className={`${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Latest Videos
        </h2>
      </div>

      {/* Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}
