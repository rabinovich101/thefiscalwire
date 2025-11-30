import Image from "next/image";
import { InlineQuote } from "./InlineQuote";
import { InlineCallout } from "./InlineCallout";
import { InlineStockChart } from "./InlineStockChart";
import { ArticleTags } from "./ArticleTags";
import type { ArticleContentBlock, ArticleDetail } from "@/lib/data";

interface ArticleBodyProps {
  article: ArticleDetail;
}

function renderContentBlock(block: ArticleContentBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={index}
          className={`text-lg leading-relaxed text-foreground/90 mb-6 ${
            index === 0 ? "text-xl lg:text-2xl" : ""
          }`}
        >
          {block.content}
        </p>
      );

    case "heading":
      if (block.level === 2) {
        return (
          <h2
            key={index}
            id={block.content?.toLowerCase().replace(/\s+/g, "-")}
            className="text-2xl font-bold text-foreground mt-12 mb-4 scroll-mt-32"
          >
            {block.content}
          </h2>
        );
      }
      return (
        <h3
          key={index}
          id={block.content?.toLowerCase().replace(/\s+/g, "-")}
          className="text-xl font-semibold text-foreground mt-8 mb-3 scroll-mt-32"
        >
          {block.content}
        </h3>
      );

    case "quote":
      return (
        <InlineQuote
          key={index}
          content={block.content || ""}
          attribution={block.attribution}
        />
      );

    case "callout":
      return <InlineCallout key={index} content={block.content || ""} />;

    case "chart":
      if (block.chartData && block.chartSymbol) {
        return (
          <InlineStockChart
            key={index}
            symbol={block.chartSymbol}
            data={block.chartData}
          />
        );
      }
      return null;

    case "list":
      return (
        <ul key={index} className="my-6 ml-6 space-y-2">
          {block.items?.map((item, i) => (
            <li
              key={i}
              className="text-lg text-foreground/90 list-disc marker:text-primary"
            >
              {item}
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <figure key={index} className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-surface">
            <Image
              src={block.imageUrl || ""}
              alt={block.imageCaption || "Article image"}
              fill
              className="object-cover"
            />
          </div>
          {block.imageCaption && (
            <figcaption className="mt-3 text-sm text-muted-foreground text-center">
              {block.imageCaption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}

export function ArticleBody({ article }: ArticleBodyProps) {
  return (
    <article className="max-w-none">
      {/* Article Content */}
      <div className="article-content">
        {article.content.map((block, index) => renderContentBlock(block, index))}
      </div>

      {/* Tags */}
      <ArticleTags tags={article.tags} />
    </article>
  );
}
