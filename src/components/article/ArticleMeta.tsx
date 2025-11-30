"use client";

import { Clock, Share2, Twitter, Linkedin, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleMetaProps {
  author: string;
  publishedAt: string;
  readTime: number;
  className?: string;
}

export function ArticleMeta({ author, publishedAt, readTime, className = "" }: ArticleMetaProps) {
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = document.title;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        break;
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Author & Time Info */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="font-medium text-gray-300">{author}</span>
        <span>•</span>
        <span>{publishedAt}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {readTime} min read
        </span>
      </div>

      {/* Share Buttons */}
      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-surface"
          onClick={() => handleShare("twitter")}
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-surface"
          onClick={() => handleShare("linkedin")}
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-surface"
          onClick={() => handleShare("copy")}
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
