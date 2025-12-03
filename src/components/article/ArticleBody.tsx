import Image from "next/image";
import { InlineQuote } from "./InlineQuote";
import { InlineCallout } from "./InlineCallout";
import { InlineStockChart } from "./InlineStockChart";
import { ArticleTags } from "./ArticleTags";
import type { ArticleContentBlock, ArticleDetail } from "@/lib/data";

interface ArticleBodyProps {
  article: ArticleDetail;
}

// Filter out "ONLY AVAILABLE IN PAID PLANS" message from NewsData.io free tier
function isPaidPlanMessage(text: string | undefined | null): boolean {
  return !!text && text.toUpperCase().includes('ONLY AVAILABLE IN PAID PLANS');
}

function renderContentBlock(block: ArticleContentBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      // Skip paragraphs with paid plan message
      if (isPaidPlanMessage(block.content)) {
        return null;
      }
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
      if (block.chartSymbol) {
        return (
          <InlineStockChart
            key={index}
            symbol={block.chartSymbol}
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
        <figure key={index} className="my-10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted/30">
            <Image
              src={block.imageUrl || ""}
              alt={block.imageCaption || "Article image"}
              fill
              className="object-cover object-center transition-opacity duration-300"
              quality={80}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {block.imageCaption && (
            <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
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
