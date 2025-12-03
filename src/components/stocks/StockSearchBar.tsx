"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

interface StockSearchBarProps {
  variant?: "default" | "hero" | "header";
  placeholder?: string;
  autoFocus?: boolean;
  onSelect?: (symbol: string) => void;
  className?: string;
}

export function StockSearchBar({
  variant = "default",
  placeholder = "Search stocks by symbol or company name...",
  autoFocus = false,
  onSelect,
  className,
}: StockSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (symbol: string) => {
      setQuery("");
      setIsOpen(false);
      if (onSelect) {
        onSelect(symbol);
      } else {
        router.push(`/stocks/${symbol}`);
      }
    },
    [router, onSelect]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.length > 0) {
        handleSelect(query.toUpperCase());
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex].symbol);
        } else if (query.length > 0) {
          handleSelect(query.toUpperCase());
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "etf":
        return <Building2 className="h-4 w-4 text-muted-foreground" />;
      default:
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div
        className={cn(
          "relative flex items-center transition-all duration-200",
          variant === "hero" && "max-w-2xl mx-auto",
          variant === "header" && "max-w-xs"
        )}
      >
        <div
          className={cn(
            "relative flex items-center w-full rounded-2xl transition-all duration-200",
            "bg-surface border border-border/50",
            "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20",
            variant === "hero" && "shadow-lg shadow-black/5",
            isOpen && results.length > 0 && "rounded-b-none border-b-transparent"
          )}
        >
          <Search
            className={cn(
              "absolute left-4 h-5 w-5 text-muted-foreground transition-colors",
              isLoading && "animate-pulse"
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 1 && results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              "w-full bg-transparent py-3.5 pl-12 pr-10 text-base",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none",
              "font-medium tracking-tight",
              variant === "hero" && "py-4 text-lg",
              variant === "header" && "py-2.5 text-sm"
            )}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          className={cn(
            "absolute left-0 right-0 z-50 overflow-hidden",
            "bg-surface border border-border/50 border-t-0",
            "rounded-b-2xl shadow-xl shadow-black/10",
            variant === "hero" && "max-w-2xl mx-auto left-1/2 -translate-x-1/2 w-full"
          )}
        >
          <div className="py-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {results.map((result, index) => (
              <button
                key={result.symbol}
                onClick={() => handleSelect(result.symbol)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 text-left",
                  "transition-colors duration-100",
                  selectedIndex === index
                    ? "bg-primary/10"
                    : "hover:bg-muted/50"
                )}
              >
                {/* Type Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                  {getTypeIcon(result.type)}
                </div>

                {/* Stock Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground tracking-tight">
                      {result.symbol}
                    </span>
                    <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {result.name}
                  </p>
                </div>

                {/* Exchange */}
                <span className="text-xs text-muted-foreground font-medium">
                  {result.exchange}
                </span>
              </button>
            ))}
          </div>

          {/* Footer with count and keyboard hints */}
          <div className="px-4 py-2.5 border-t border-border/50 bg-muted/30 sticky bottom-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">↵</kbd>
                  <span>select</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 1 && !isLoading && results.length === 0 && (
        <div
          className={cn(
            "absolute left-0 right-0 z-50",
            "bg-surface border border-border/50 border-t-0",
            "rounded-b-2xl shadow-xl shadow-black/10",
            "px-4 py-8 text-center",
            variant === "hero" && "max-w-2xl mx-auto left-1/2 -translate-x-1/2 w-full"
          )}
        >
          <p className="text-muted-foreground">
            No results for &quot;{query}&quot;
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Try searching by ticker symbol (e.g., AAPL, MSFT)
          </p>
        </div>
      )}
    </div>
  );
}
