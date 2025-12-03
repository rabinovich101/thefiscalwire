"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Newspaper, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: number;
  thumbnail: string | null;
  relatedTickers: string[];
}

interface StockNewsProps {
  symbol: string;
  initialNews?: NewsItem[];
  limit?: number;
}

export function StockNews({ symbol, initialNews, limit = 5 }: StockNewsProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews || []);
  const [isLoading, setIsLoading] = useState(!initialNews);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (initialNews) return;

    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stocks/${symbol}/news`);
        const data = await res.json();
        setNews(data.news || []);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [symbol, initialNews]);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const displayedNews = showAll ? news : news.slice(0, limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <Newspaper className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <p className="text-muted-foreground">No recent news for {symbol}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-0 divide-y divide-border/50">
        {displayedNews.map((item, index) => (
          <a
            key={item.uuid}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex gap-4 py-4 transition-colors",
              "hover:bg-muted/30 -mx-4 px-4 rounded-xl",
              index === 0 && "pt-0"
            )}
          >
            {/* Thumbnail */}
            {item.thumbnail ? (
              <div className="relative flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 96px, 128px"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 rounded-lg bg-muted flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-muted-foreground/50" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <h4 className="font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{item.publisher}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(item.publishedAt)}
                </span>
              </div>
              {item.relatedTickers.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.relatedTickers.slice(0, 5).map((ticker) => (
                    <span
                      key={ticker}
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded",
                        ticker === symbol
                          ? "bg-primary/10 text-primary font-medium"
                          : "bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {ticker}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* External Link Icon */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </a>
        ))}
      </div>

      {/* Show More/Less */}
      {news.length > limit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {showAll ? "Show Less" : `Show ${news.length - limit} More`}
        </button>
      )}
    </div>
  );
}
