"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import type { ArticleHeading } from "@/lib/data";

interface ArticleTOCProps {
  headings: ArticleHeading[];
}

export function ArticleTOC({ headings }: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <List className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Contents</h3>
      </div>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => handleClick(heading.id)}
            className={`block w-full text-left text-sm py-1.5 transition-colors ${
              heading.level === 3 ? "pl-4" : "pl-0"
            } ${
              activeId === heading.id
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
