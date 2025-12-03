import Link from "next/link";
import { SearchX, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StockNotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Stock Not Found</h1>
          <p className="text-muted-foreground">
            We couldn&apos;t find any stock matching that symbol. Please check the
            ticker and try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/stocks">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Stocks
            </Button>
          </Link>
          <Link href="/stocks">
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Search Again
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
