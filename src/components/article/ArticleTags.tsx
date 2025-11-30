import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ArticleTagsProps {
  tags: string[];
}

export function ArticleTags({ tags }: ArticleTagsProps) {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Topics</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag} href={`/topic/${tag.toLowerCase().replace(/\s+/g, "-")}`}>
            <Badge
              variant="secondary"
              className="bg-surface hover:bg-surface-hover text-foreground transition-colors cursor-pointer"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
