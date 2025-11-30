import { ArticleCard } from "@/components/ui/ArticleCard";
import type { Article } from "@/lib/data";

interface ArticleGridProps {
  articles: Article[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
