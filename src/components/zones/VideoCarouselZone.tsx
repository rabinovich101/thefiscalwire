"use client"

import Image from "next/image"
import { useState } from "react"
import { Play, X } from "lucide-react"
import { ZoneProps, isVideo, ZoneVideo } from "./types"

interface VideoCardProps {
  video: ZoneVideo
}

function getEmbedUrl(video: ZoneVideo): string | null {
  if (!video.embedType || !video.videoId) return null

  switch (video.embedType) {
    case "youtube":
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1`
    case "vimeo":
      return `https://player.vimeo.com/video/${video.videoId}?autoplay=1`
    default:
      return null
  }
}

function VideoCard({ video }: VideoCardProps) {
  const [showPlayer, setShowPlayer] = useState(false)
  const embedUrl = getEmbedUrl(video)

  // If it's an embeddable video, show the player on click
  if (embedUrl) {
    return (
      <div className="group flex flex-col shrink-0 w-80">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {showPlayer ? (
            <>
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setShowPlayer(false)}
                className="absolute top-2 right-2 z-10 bg-black/80 text-white p-1 rounded-full hover:bg-black"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <button
                onClick={() => setShowPlayer(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="h-6 w-6 text-black fill-black ml-0.5" />
                </div>
              </button>
              {video.duration && video.duration !== "0:00" && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              )}
            </>
          )}
        </div>
        <h3 className="mt-2 text-sm font-medium text-foreground line-clamp-2">
          {video.title}
        </h3>
        <span className="mt-1 text-xs text-muted-foreground">{video.category}</span>
      </div>
    )
  }

  // Fallback for non-embeddable videos (just show thumbnail)
  return (
    <div className="group flex flex-col shrink-0 w-80">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="h-5 w-5 text-black fill-black ml-0.5" />
          </div>
        </div>
        {video.duration && video.duration !== "0:00" && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {video.title}
      </h3>
      <span className="mt-1 text-xs text-muted-foreground">{video.category}</span>
    </div>
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
