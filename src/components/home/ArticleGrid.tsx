import { ArticleCard } from "@/components/ui/ArticleCard";
import { topStories } from "@/data/mockData";

export function ArticleGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {topStories.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
