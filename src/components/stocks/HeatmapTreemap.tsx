"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SECTORS_WITH_INDUSTRIES,
  getSectorName,
  getIndustryName,
} from "@/lib/stock-lists";

// Types
interface HeatmapStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  sectorId: string;
  industryId: string;
  value: number;
}

interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface StockNode extends TreemapRect {
  type: "stock";
  stock: HeatmapStock;
}

interface IndustryNode extends TreemapRect {
  type: "industry";
  industryId: string;
  name: string;
  children: StockNode[];
  totalMarketCap: number;
}

interface SectorNode extends TreemapRect {
  type: "sector";
  sectorId: string;
  name: string;
  children: IndustryNode[];
  totalMarketCap: number;
}

interface HeatmapTreemapProps {
  stocks: HeatmapStock[];
  dataType: string;
  onStockHover?: (symbol: string | null) => void;
  highlightedStock?: string | null;
  width?: number;
  height?: number;
}

// Color scale for percentage changes (finviz-style)
function getColorForValue(value: number, dataType: string): string {
  // For performance metrics, use the standard red-green scale
  if (dataType.startsWith("d") || dataType.startsWith("w") || dataType.startsWith("m") || dataType.startsWith("y") || dataType === "intraday" || dataType === "mtd" || dataType === "ytd") {
    if (value <= -6) return "#7c0a02";
    if (value <= -5) return "#8b1a10";
    if (value <= -4) return "#9c2a1e";
    if (value <= -3) return "#b33a2c";
    if (value <= -2) return "#c74a3a";
    if (value <= -1) return "#d85a4a";
    if (value <= -0.5) return "#e06a5a";
    if (value < 0) return "#e57a6a";
    if (value === 0) return "#444444";
    if (value < 0.5) return "#4a7a4a";
    if (value < 1) return "#4a8a4a";
    if (value < 2) return "#3a9a3a";
    if (value < 3) return "#2aaa2a";
    if (value < 4) return "#1aba1a";
    if (value < 5) return "#0aca0a";
    if (value < 6) return "#00da00";
    return "#00ea00";
  }

  // For other metrics (P/E, etc.), use a blue scale
  return "#4a5568";
}

// Get text color based on background
function getTextColor(value: number, dataType: string): string {
  // Light text for most backgrounds
  return "#ffffff";
}

// Squarified treemap algorithm
function squarify(
  data: { value: number; item: unknown }[],
  rect: TreemapRect,
  totalValue: number
): (TreemapRect & { item: unknown })[] {
  if (data.length === 0) return [];
  if (data.length === 1) {
    return [{ ...rect, item: data[0].item }];
  }

  const { x, y, width, height } = rect;
  const area = width * height;

  // Calculate areas for each item
  const items = data.map((d) => ({
    ...d,
    area: (d.value / totalValue) * area,
  }));

  // Sort by value descending
  items.sort((a, b) => b.value - a.value);

  const results: (TreemapRect & { item: unknown })[] = [];
  let remaining = [...items];
  let currentRect = { x, y, width, height };

  while (remaining.length > 0) {
    const isWide = currentRect.width >= currentRect.height;
    const side = isWide ? currentRect.height : currentRect.width;

    // Find the best row
    let row: typeof items = [];
    let rowArea = 0;
    let worstRatio = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const testRow = [...row, remaining[i]];
      const testArea = rowArea + remaining[i].area;
      const testRatio = calculateWorstRatio(testRow, side, testArea);

      if (testRatio <= worstRatio) {
        row = testRow;
        rowArea = testArea;
        worstRatio = testRatio;
      } else {
        break;
      }
    }

    // Layout the row
    const rowLength = rowArea / side;
    let offset = 0;

    for (const item of row) {
      const itemLength = item.area / rowLength;

      if (isWide) {
        results.push({
          x: currentRect.x,
          y: currentRect.y + offset,
          width: rowLength,
          height: itemLength,
          item: item.item,
        });
      } else {
        results.push({
          x: currentRect.x + offset,
          y: currentRect.y,
          width: itemLength,
          height: rowLength,
          item: item.item,
        });
      }

      offset += itemLength;
    }

    // Update remaining and rect
    remaining = remaining.slice(row.length);

    if (isWide) {
      currentRect = {
        x: currentRect.x + rowLength,
        y: currentRect.y,
        width: currentRect.width - rowLength,
        height: currentRect.height,
      };
    } else {
      currentRect = {
        x: currentRect.x,
        y: currentRect.y + rowLength,
        width: currentRect.width,
        height: currentRect.height - rowLength,
      };
    }
  }

  return results;
}

function calculateWorstRatio(
  row: { area: number }[],
  side: number,
  totalArea: number
): number {
  if (row.length === 0) return Infinity;

  const rowLength = totalArea / side;
  let worst = 0;

  for (const item of row) {
    const itemLength = item.area / rowLength;
    const ratio = Math.max(rowLength / itemLength, itemLength / rowLength);
    worst = Math.max(worst, ratio);
  }

  return worst;
}

// Compress market cap for better visual proportions (like finviz)
// This prevents mega-caps from dominating the entire view
function compressMarketCap(marketCap: number): number {
  // Use square root to compress the scale
  // This makes a $3T company only ~5x larger than a $100B company instead of 30x
  return Math.sqrt(marketCap);
}

// Build hierarchical treemap data
function buildTreemapData(
  stocks: HeatmapStock[],
  containerWidth: number,
  containerHeight: number
): SectorNode[] {
  // Group stocks by sector and industry
  const sectorGroups = new Map<string, Map<string, HeatmapStock[]>>();

  for (const stock of stocks) {
    const sectorId = stock.sectorId || "other";
    const industryId = stock.industryId || "other";

    if (!sectorGroups.has(sectorId)) {
      sectorGroups.set(sectorId, new Map());
    }

    const industryGroups = sectorGroups.get(sectorId)!;
    if (!industryGroups.has(industryId)) {
      industryGroups.set(industryId, []);
    }

    industryGroups.get(industryId)!.push(stock);
  }

  // Calculate total compressed market cap
  const totalMarketCap = stocks.reduce((sum, s) => sum + compressMarketCap(s.marketCap), 0);

  // Build sector data
  const sectorData: { value: number; item: { sectorId: string; industries: Map<string, HeatmapStock[]>; totalMarketCap: number } }[] = [];

  for (const [sectorId, industries] of sectorGroups) {
    let sectorMarketCap = 0;
    for (const industryStocks of industries.values()) {
      for (const stock of industryStocks) {
        sectorMarketCap += compressMarketCap(stock.marketCap);
      }
    }

    sectorData.push({
      value: sectorMarketCap,
      item: { sectorId, industries, totalMarketCap: sectorMarketCap },
    });
  }

  // Sort sectors by market cap
  sectorData.sort((a, b) => b.value - a.value);

  // Layout sectors
  const sectorRects = squarify(
    sectorData,
    { x: 0, y: 0, width: containerWidth, height: containerHeight },
    totalMarketCap
  );

  // Build sector nodes with industries
  const sectorNodes: SectorNode[] = [];

  for (const sectorRect of sectorRects) {
    const sectorItem = sectorRect.item as { sectorId: string; industries: Map<string, HeatmapStock[]>; totalMarketCap: number };
    const { sectorId, industries, totalMarketCap: sectorMarketCap } = sectorItem;

    // Header height for sector label
    const headerHeight = Math.min(20, sectorRect.height * 0.12);
    const contentRect = {
      x: sectorRect.x + 1,
      y: sectorRect.y + headerHeight + 1,
      width: Math.max(0, sectorRect.width - 2),
      height: Math.max(0, sectorRect.height - headerHeight - 2),
    };

    // Build industry data
    const industryData: { value: number; item: { industryId: string; stocks: HeatmapStock[]; totalMarketCap: number } }[] = [];

    for (const [industryId, industryStocks] of industries) {
      const industryMarketCap = industryStocks.reduce((sum, s) => sum + compressMarketCap(s.marketCap), 0);
      industryData.push({
        value: industryMarketCap,
        item: { industryId, stocks: industryStocks, totalMarketCap: industryMarketCap },
      });
    }

    // Layout industries within sector
    const industryRects = squarify(industryData, contentRect, sectorMarketCap);

    // Build industry nodes with stocks
    const industryNodes: IndustryNode[] = [];

    for (const industryRect of industryRects) {
      const industryItem = industryRect.item as { industryId: string; stocks: HeatmapStock[]; totalMarketCap: number };
      const { industryId, stocks: industryStocks, totalMarketCap: industryMarketCap } = industryItem;

      // Header height for industry label (smaller than sector)
      const industryHeaderHeight = Math.min(14, industryRect.height * 0.15);
      const stocksRect = {
        x: industryRect.x + 1,
        y: industryRect.y + industryHeaderHeight,
        width: Math.max(0, industryRect.width - 2),
        height: Math.max(0, industryRect.height - industryHeaderHeight - 1),
      };

      // Build stock data (using compressed market cap for sizing)
      const stockData = industryStocks.map((stock) => ({
        value: compressMarketCap(stock.marketCap),
        item: stock,
      }));

      // Layout stocks within industry
      const stockRects = squarify(stockData, stocksRect, industryMarketCap);

      const stockNodes: StockNode[] = stockRects.map((rect) => ({
        ...rect,
        type: "stock" as const,
        stock: rect.item as HeatmapStock,
      }));

      industryNodes.push({
        x: industryRect.x,
        y: industryRect.y,
        width: industryRect.width,
        height: industryRect.height,
        type: "industry",
        industryId,
        name: getIndustryName(industryId),
        children: stockNodes,
        totalMarketCap: industryMarketCap,
      });
    }

    sectorNodes.push({
      x: sectorRect.x,
      y: sectorRect.y,
      width: sectorRect.width,
      height: sectorRect.height,
      type: "sector",
      sectorId,
      name: getSectorName(sectorId),
      children: industryNodes,
      totalMarketCap: sectorMarketCap,
    });
  }

  return sectorNodes;
}

// Format value for display
function formatValue(value: number, dataType: string): string {
  // Performance metrics show as percentage
  if (dataType.startsWith("d") || dataType.startsWith("w") || dataType.startsWith("m") || dataType.startsWith("y") || dataType === "intraday" || dataType === "mtd" || dataType === "ytd") {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  }

  // Ratio metrics
  if (["pe", "fpe", "peg", "ps", "pb", "evebitda", "evsales", "de", "currentr", "quickr"].includes(dataType)) {
    return value.toFixed(2);
  }

  // Percentage metrics
  if (["divyield", "roe", "roa", "netm", "operm", "grossm", "short", "epsqq", "salesqq"].includes(dataType)) {
    return `${value.toFixed(2)}%`;
  }

  return value.toFixed(2);
}

// Format market cap
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toFixed(2)}`;
}

// Main component
export function HeatmapTreemap({
  stocks,
  dataType,
  onStockHover,
  highlightedStock,
  width = 1000,
  height = 700,
}: HeatmapTreemapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastZoomTime = useRef<number>(0);
  const originalOverflow = useRef<string>('');
  const [dimensions, setDimensions] = useState({ width, height });
  const [hoveredStock, setHoveredStock] = useState<HeatmapStock | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Zoom/pan state - combined into single object for atomic updates
  const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        setDimensions({ width: w, height: h });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Handle wheel zoom with native event listener (passive: false required for preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      lastZoomTime.current = Date.now();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Atomic update of both scale and translate to fix zoom-to-mouse
      setTransform(prev => {
        const newScale = Math.min(Math.max(prev.scale * zoomFactor, 1), 5);

        if (newScale === 1) {
          return { scale: 1, translateX: 0, translateY: 0 };
        }

        // Zoom towards mouse position - keep point under cursor fixed
        const ratio = newScale / prev.scale;
        return {
          scale: newScale,
          translateX: mouseX - (mouseX - prev.translateX) * ratio,
          translateY: mouseY - (mouseY - prev.translateY) * ratio,
        };
      });
    };

    container.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelNative);
  }, []);

  // Build treemap data
  const treemapData = useMemo(() => {
    if (stocks.length === 0) return [];
    return buildTreemapData(stocks, dimensions.width, dimensions.height);
  }, [stocks, dimensions.width, dimensions.height]);

  // Handle stock click (ignore clicks right after zooming)
  const handleStockClick = (stock: HeatmapStock) => {
    if (Date.now() - lastZoomTime.current < 200) {
      return;
    }
    router.push(`/stocks/${stock.symbol}`);
  };

  // Handle mouse move for tooltip and panning
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    // Handle panning
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        translateX: e.clientX - dragStart.x,
        translateY: e.clientY - dragStart.y,
      }));
    }
  };

  // Handle drag start for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (transform.scale > 1) { // Only pan when zoomed in
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.translateX, y: e.clientY - transform.translateY });
    }
  };

  // Handle drag end
  const handleMouseUp = () => setIsDragging(false);

  // Handle mouse enter - lock body scroll
  const handleMouseEnter = () => {
    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  };

  // Handle mouse leave - restore body scroll
  const handleMouseLeave = () => {
    document.body.style.overflow = originalOverflow.current;
    setHoveredStock(null);
    onStockHover?.(null);
    handleMouseUp();
  };

  // Reset zoom on double-click
  const handleDoubleClick = (e: React.MouseEvent) => {
    // Reset zoom when double-clicking
    if (transform.scale !== 1) {
      setTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#111827] overflow-hidden"
      style={{ touchAction: 'none' }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="block"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: isDragging ? 'grabbing' : (transform.scale > 1 ? 'grab' : 'default') }}
      >
        <g transform={`scale(${transform.scale}) translate(${transform.translateX / transform.scale}, ${transform.translateY / transform.scale})`}>
        {treemapData.map((sector) => (
          <g key={sector.sectorId}>
            {/* Sector background and border */}
            <rect
              x={sector.x}
              y={sector.y}
              width={sector.width}
              height={sector.height}
              fill="#111827"
              stroke="#1f2937"
              strokeWidth={2}
            />

            {/* Sector label */}
            {sector.width > 80 && sector.height > 30 && (
              <text
                x={sector.x + 4}
                y={sector.y + 14}
                fill="#9ca3af"
                fontSize={11}
                fontWeight={600}
                className="pointer-events-none select-none"
              >
                {sector.name}
              </text>
            )}

            {/* Industries */}
            {sector.children.map((industry) => (
              <g key={`${sector.sectorId}-${industry.industryId}`}>
                {/* Industry label */}
                {industry.width > 60 && industry.height > 25 && (
                  <text
                    x={industry.x + 3}
                    y={industry.y + 10}
                    fill="#6b7280"
                    fontSize={9}
                    fontWeight={500}
                    className="pointer-events-none select-none"
                  >
                    {industry.name.length > Math.floor(industry.width / 6)
                      ? industry.name.substring(0, Math.floor(industry.width / 6)) + "..."
                      : industry.name}
                  </text>
                )}

                {/* Stocks */}
                {industry.children.map((node) => {
                  const stock = node.stock;
                  const bgColor = getColorForValue(stock.value, dataType);
                  const textColor = getTextColor(stock.value, dataType);
                  const isHighlighted = highlightedStock === stock.symbol;
                  const isHovered = hoveredStock?.symbol === stock.symbol;

                  // Calculate what to show based on box size
                  const showSymbol = node.width > 25 && node.height > 18;
                  const showValue = node.width > 40 && node.height > 32;

                  // Dynamic font size
                  const symbolSize = Math.min(
                    Math.max(node.width / 5, 8),
                    Math.max(node.height / 3, 8),
                    14
                  );
                  const valueSize = Math.min(symbolSize - 2, 10);

                  return (
                    <g
                      key={stock.symbol}
                      onClick={() => handleStockClick(stock)}
                      onMouseEnter={() => {
                        setHoveredStock(stock);
                        onStockHover?.(stock.symbol);
                      }}
                      onMouseLeave={() => {
                        setHoveredStock(null);
                        onStockHover?.(null);
                      }}
                      className="cursor-pointer"
                    >
                      <rect
                        x={node.x}
                        y={node.y}
                        width={node.width}
                        height={node.height}
                        fill={bgColor}
                        stroke={isHighlighted || isHovered ? "#ffffff" : "#1f2937"}
                        strokeWidth={isHighlighted || isHovered ? 2 : 0.5}
                        rx={1}
                        className="transition-all duration-100"
                        style={{
                          opacity: isHovered ? 0.85 : 1,
                        }}
                      />

                      {showSymbol && (
                        <text
                          x={node.x + node.width / 2}
                          y={node.y + node.height / 2 - (showValue ? 5 : 0)}
                          fill={textColor}
                          fontSize={symbolSize}
                          fontWeight={600}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="pointer-events-none select-none"
                        >
                          {stock.symbol}
                        </text>
                      )}

                      {showValue && (
                        <text
                          x={node.x + node.width / 2}
                          y={node.y + node.height / 2 + 8}
                          fill={textColor}
                          fontSize={valueSize}
                          fontWeight={400}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="pointer-events-none select-none"
                          style={{ opacity: 0.9 }}
                        >
                          {formatValue(stock.value, dataType)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredStock && (
        <div
          className="absolute pointer-events-none z-50 bg-[#1f2937] border border-[#374151] rounded-lg shadow-xl p-3 min-w-[200px]"
          style={{
            left: Math.min(mousePos.x + 15, dimensions.width - 220),
            top: Math.min(mousePos.y + 15, dimensions.height - 150),
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-white text-base">
              {hoveredStock.symbol}
            </span>
            <span
              className={`text-sm font-semibold ${
                hoveredStock.value >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatValue(hoveredStock.value, dataType)}
            </span>
          </div>
          <p className="text-gray-400 text-xs mb-2 truncate">
            {hoveredStock.name}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Price</span>
              <p className="text-white font-medium">
                ${hoveredStock.price.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Market Cap</span>
              <p className="text-white font-medium">
                {formatMarketCap(hoveredStock.marketCap)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
