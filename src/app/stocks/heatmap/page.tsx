import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StockHeatmap } from "@/components/stocks";

export const metadata: Metadata = {
  title: "Stock Market Heatmap | The Fiscal Wire",
  description:
    "Interactive market heatmap visualization. View S&P 500, Dow Jones, Nasdaq 100, Russell 2000, ETFs, and Crypto by sector and industry.",
  keywords: [
    "stock heatmap",
    "market map",
    "S&P 500 heatmap",
    "sector performance",
    "stock visualization",
    "market sectors",
    "treemap",
    "finviz alternative",
  ],
};

export const dynamic = "force-dynamic";

export default function HeatmapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <Header />
      <main className="flex-1 py-4">
        <div className="mx-auto max-w-[1800px] px-4">
          <StockHeatmap />
        </div>
      </main>
      <Footer />
    </div>
  );
}
