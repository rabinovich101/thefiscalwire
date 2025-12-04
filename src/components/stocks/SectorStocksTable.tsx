"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { type SectorStock } from "@/lib/yahoo-finance";

type SortField = "symbol" | "price" | "changePercent" | "marketCap";
type SortDirection = "asc" | "desc";

interface SectorStocksTableProps {
  sectorId: string;
  initialStocks: SectorStock[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function formatMarketCap(value: number) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function StockRow({ stock, rank }: { stock: SectorStock; rank: number }) {
  const isPositive = stock.changePercent >= 0;

  // Calculate 52-week position
  const weekRange = stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow;
  const weekPosition =
    weekRange > 0
      ? ((stock.price - stock.fiftyTwoWeekLow) / weekRange) * 100
      : 50;

  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      className="group grid grid-cols-12 gap-4 items-center px-4 py-4 hover:bg-muted/30 transition-colors border-b border-border/30 last:border-b-0"
    >
      {/* Rank */}
      <div className="col-span-1 text-sm font-medium text-muted-foreground">
        {rank}
      </div>

      {/* Symbol & Name */}
      <div className="col-span-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {stock.symbol}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
        </div>
        <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
      </div>

      {/* Price */}
      <div className="col-span-2 text-right">
        <div className="font-semibold tabular-nums">{formatPrice(stock.price)}</div>
      </div>

      {/* Change */}
      <div className="col-span-2 text-right">
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive
              ? "bg-positive/10 text-positive"
              : "bg-negative/10 text-negative"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          <span className="tabular-nums">
            {isPositive ? "+" : ""}
            {stock.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Market Cap */}
      <div className="col-span-2 text-right hidden sm:block">
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatMarketCap(stock.marketCap)}
        </span>
      </div>

      {/* 52W Range */}
      <div className="col-span-2 hidden lg:block">
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-negative/40 via-muted-foreground/30 to-positive/40 rounded-full w-full" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-foreground rounded-full border-2 border-background shadow-sm"
            style={{
              left: `calc(${Math.min(100, Math.max(0, weekPosition))}% - 5px)`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
          <span>{formatPrice(stock.fiftyTwoWeekLow)}</span>
          <span>{formatPrice(stock.fiftyTwoWeekHigh)}</span>
        </div>
      </div>
    </Link>
  );
}

// Sortable column header component
function SortableHeader({
  field,
  label,
  currentSort,
  currentDirection,
  onSort,
  align = "left",
}: {
  field: SortField;
  label: string;
  currentSort: SortField | null;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  align?: "left" | "right" | "center";
}) {
  const isActive = currentSort === field;
  const alignClass = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";

  return (
    <button
      onClick={() => onSort(field)}
      className={`flex items-center gap-1 ${alignClass} w-full hover:text-foreground transition-colors group`}
    >
      <span>{label}</span>
      {isActive ? (
        currentDirection === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5 text-primary" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-primary" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </button>
  );
}

export function SectorStocksTable({
  sectorId,
  initialStocks,
  initialPagination,
}: SectorStocksTableProps) {
  const [stocks, setStocks] = useState<SectorStock[]>(initialStocks);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Handle sort click
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // New field - default to desc for numeric, asc for symbol
      setSortField(field);
      setSortDirection(field === "symbol" ? "asc" : "desc");
    }
  }, [sortField]);

  // Sort stocks
  const sortedStocks = useMemo(() => {
    if (!sortField) return stocks;

    return [...stocks].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "changePercent":
          comparison = a.changePercent - b.changePercent;
          break;
        case "marketCap":
          comparison = a.marketCap - b.marketCap;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [stocks, sortField, sortDirection]);

  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = pagination.page + 1;
      const response = await fetch(
        `/api/stocks/sectors/${sectorId}?page=${nextPage}&limit=${pagination.limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more stocks");
      }

      const data = await response.json();

      if (data.success) {
        setStocks((prev) => [...prev, ...data.data.stocks]);
        setPagination({
          page: data.data.pagination.page,
          limit: data.data.pagination.limit,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
          hasMore: data.data.pagination.hasMore,
        });
      } else {
        throw new Error(data.error || "Failed to fetch stocks");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more stocks");
    } finally {
      setLoading(false);
    }
  }, [sectorId, pagination, loading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [pagination.hasMore, loading, loadMore]);

  return (
    <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <div className="col-span-1">#</div>
        <div className="col-span-3">
          <SortableHeader
            field="symbol"
            label="Stock"
            currentSort={sortField}
            currentDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
        <div className="col-span-2">
          <SortableHeader
            field="price"
            label="Price"
            currentSort={sortField}
            currentDirection={sortDirection}
            onSort={handleSort}
            align="right"
          />
        </div>
        <div className="col-span-2">
          <SortableHeader
            field="changePercent"
            label="Change"
            currentSort={sortField}
            currentDirection={sortDirection}
            onSort={handleSort}
            align="right"
          />
        </div>
        <div className="col-span-2 hidden sm:block">
          <SortableHeader
            field="marketCap"
            label="Market Cap"
            currentSort={sortField}
            currentDirection={sortDirection}
            onSort={handleSort}
            align="right"
          />
        </div>
        <div className="col-span-2 text-center hidden lg:block">52W Range</div>
      </div>

      {/* Table Body */}
      <div>
        {sortedStocks.map((stock, index) => (
          <StockRow key={stock.symbol} stock={stock} rank={sortField ? index + 1 : index + 1} />
        ))}
      </div>

      {/* Loading indicator / Load more trigger */}
      <div ref={loadMoreRef} className="py-4">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading more stocks...</span>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <p className="text-sm text-negative">{error}</p>
            <button
              onClick={loadMore}
              className="text-sm text-primary hover:text-primary/80 underline"
            >
              Try again
            </button>
          </div>
        )}
        {!loading && !error && pagination.hasMore && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              Showing {stocks.length} of {pagination.total} stocks
            </span>
          </div>
        )}
        {!pagination.hasMore && stocks.length > 0 && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              All {pagination.total} stocks loaded
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
