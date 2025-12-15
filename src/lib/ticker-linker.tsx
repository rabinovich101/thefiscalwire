import Link from "next/link";
import React from "react";

/**
 * Links ticker symbols in text to their corresponding stock pages.
 * Only links tickers that are in the relevantTickers array.
 *
 * @param text - The text to process
 * @param relevantTickers - Array of ticker symbols to link (e.g., ["AAPL", "MSFT"])
 * @returns React nodes with ticker mentions wrapped in links
 */
export function linkTickersInText(
  text: string,
  relevantTickers: string[]
): React.ReactNode {
  if (!text || !relevantTickers || relevantTickers.length === 0) {
    return text;
  }

  // Escape special regex characters in tickers and create pattern
  const escapedTickers = relevantTickers.map((ticker) =>
    ticker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  // Match tickers as whole words, case-insensitive
  const tickerPattern = new RegExp(`\\b(${escapedTickers.join("|")})\\b`, "gi");

  // Split text by ticker matches
  const parts = text.split(tickerPattern);

  if (parts.length === 1) {
    // No matches found
    return text;
  }

  return parts.map((part, index) => {
    // Check if this part is a ticker (case-insensitive)
    const upperPart = part.toUpperCase();
    if (relevantTickers.map((t) => t.toUpperCase()).includes(upperPart)) {
      return (
        <Link
          key={`ticker-${index}-${part}`}
          href={`/stocks/${upperPart}`}
          className="text-primary hover:underline font-medium"
        >
          {part}
        </Link>
      );
    }
    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
}

/**
 * Process multiple text segments and link tickers.
 * Useful for list items or other structured content.
 *
 * @param items - Array of text strings to process
 * @param relevantTickers - Array of ticker symbols to link
 * @returns Array of React nodes with linked tickers
 */
export function linkTickersInItems(
  items: string[],
  relevantTickers: string[]
): React.ReactNode[] {
  return items.map((item, index) => (
    <React.Fragment key={`item-${index}`}>
      {linkTickersInText(item, relevantTickers)}
    </React.Fragment>
  ));
}
