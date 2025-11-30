"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  articleId: string;
  variant?: "default" | "overlay";
  className?: string;
}

export function BookmarkButton({ articleId, variant = "default", className }: BookmarkButtonProps) {
  const { bookmarkedArticles, addBookmark, removeBookmark } = useUserStore();
  const isBookmarked = bookmarkedArticles.includes(articleId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      removeBookmark(articleId);
    } else {
      addBookmark(articleId);
    }
  };

  if (variant === "overlay") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors",
          className
        )}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-colors",
            isBookmarked ? "fill-primary text-primary" : "text-white"
          )}
        />
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn("h-8 w-8", className)}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-colors",
          isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
