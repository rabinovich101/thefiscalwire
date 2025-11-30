import Link from "next/link";
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <FileX className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Article Not Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
            <Link href="/markets">
              <Button variant="outline">Browse Markets</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
