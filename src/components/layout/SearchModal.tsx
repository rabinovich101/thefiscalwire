"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getStockLogoUrl } from "@/data/stockSymbols";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  readTime: number;
  category: {
    name: string;
    slug: string;
    color: string;
  };
}

interface StockResult {
  symbol: string;
  name: string;
  exchange: string;
  type: "EQUITY" | "ETF" | "INDEX";
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [stockResults, setStockResults] = useState<StockResult[]>([]);
  const [articleResults, setArticleResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 1) {
      setStockResults([]);
      setArticleResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Search stocks and articles in parallel
      const [stocksResponse, articlesResponse] = await Promise.all([
        fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`),
        searchQuery.trim().length >= 2
          ? fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
          : Promise.resolve({ json: () => Promise.resolve({ articles: [] }) } as Response)
      ]);

      const stocksData = await stocksResponse.json();
      const articlesData = await articlesResponse.json();

      setStockResults(stocksData.results?.slice(0, 5) || []);
      setArticleResults(articlesData.articles || []);
    } catch (error) {
      console.error("Search failed:", error);
      setStockResults([]);
      setArticleResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setStockResults([]);
      setArticleResults([]);
      setHasSearched(false);
    }
  }, [open]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const handleArticleClick = (slug: string) => {
    onOpenChange(false);
    router.push(`/article/${slug}`);
  };

  const handleStockClick = (symbol: string) => {
    onOpenChange(false);
    router.push(`/stocks/${symbol}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Search articles</DialogTitle>
        </VisuallyHidden>
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search stocks & articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-4 text-base bg-transparent outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex ml-2 h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && hasSearched && stockResults.length === 0 && articleResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Try a different search term</p>
            </div>
          )}

          {!isLoading && (stockResults.length > 0 || articleResults.length > 0) && (
            <div>
              {/* Stocks Section */}
              {stockResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Stocks
                    </span>
                  </div>
                  <ul className="divide-y divide-border">
                    {stockResults.map((stock) => (
                      <li key={stock.symbol}>
                        <button
                          onClick={() => handleStockClick(stock.symbol)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden border border-border">
                            <img
                              src={getStockLogoUrl(stock.symbol)}
                              alt={stock.name}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                // Fallback to text if logo fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `<span class="text-emerald-600 font-bold text-xs">${stock.symbol.slice(0, 3)}</span>`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">
                                {stock.symbol}
                              </span>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                stock.type === "ETF"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  : stock.type === "INDEX"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              }`}>
                                {stock.type}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {stock.name}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {stock.exchange}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Articles Section */}
              {articleResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5" />
                      Articles
                    </span>
                  </div>
                  <ul className="divide-y divide-border">
                    {articleResults.map((article) => (
                      <li key={article.id}>
                        <button
                          onClick={() => handleArticleClick(article.slug)}
                          className="w-full flex items-start gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="relative w-20 h-14 shrink-0 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={article.imageUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded ${article.category.color} text-white`}
                              >
                                {article.category.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(article.publishedAt)}
                              </span>
                            </div>
                            <h4 className="font-medium text-foreground line-clamp-1 mb-1">
                              {article.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {article.excerpt}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!isLoading && !hasSearched && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Search stocks and articles</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Type a ticker symbol or search by topic
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="h-5 w-5 inline-flex items-center justify-center rounded border border-border bg-background text-[10px]">
                ↵
              </kbd>
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="h-5 w-5 inline-flex items-center justify-center rounded border border-border bg-background text-[10px]">
                ↑
              </kbd>
              <kbd className="h-5 w-5 inline-flex items-center justify-center rounded border border-border bg-background text-[10px]">
                ↓
              </kbd>
              to navigate
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Press <kbd className="font-mono">⌘K</kbd> to search
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
