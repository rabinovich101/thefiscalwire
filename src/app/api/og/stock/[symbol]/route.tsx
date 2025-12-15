import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

async function getStockData(symbol: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thefiscalwire.com";
    const res = await fetch(`${baseUrl}/api/stocks/${symbol}/quote`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const stock = await getStockData(upperSymbol);

  const price = stock?.price?.toFixed(2) || "N/A";
  const change = stock?.change || 0;
  const changePercent = ((stock?.changePercent || 0) * 100).toFixed(2);
  const name = stock?.name || upperSymbol;
  const isPositive = change >= 0;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
        }}
      >
        {/* Header with Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: 12 }}
          >
            <path
              d="M3 3v18h18"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 14l4-4 4 4 5-5"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.025em",
            }}
          >
            The Fiscal Wire
          </span>
        </div>

        {/* Stock Symbol */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.025em",
            }}
          >
            {upperSymbol}
          </span>
        </div>

        {/* Company Name */}
        <div
          style={{
            fontSize: 24,
            color: "#9ca3af",
            marginBottom: 32,
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          {name}
        </div>

        {/* Price and Change */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            ${price}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 24px",
              borderRadius: 12,
              backgroundColor: isPositive
                ? "rgba(34, 197, 94, 0.15)"
                : "rgba(239, 68, 68, 0.15)",
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: isPositive ? "#22c55e" : "#ef4444",
              }}
            >
              {isPositive ? "+" : ""}
              {changePercent}%
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#6b7280",
            fontSize: 18,
          }}
        >
          <span>thefiscalwire.com/stocks/{upperSymbol.toLowerCase()}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
