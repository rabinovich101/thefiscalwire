import { Quote } from "lucide-react";

interface InlineQuoteProps {
  content: string;
  attribution?: string;
}

export function InlineQuote({ content, attribution }: InlineQuoteProps) {
  return (
    <blockquote className="relative my-8 pl-6 border-l-4 border-primary">
      <Quote className="absolute -left-3 -top-2 h-6 w-6 text-primary/30" />
      <p className="text-xl sm:text-2xl font-medium italic text-foreground/90 leading-relaxed">
        &ldquo;{content}&rdquo;
      </p>
      {attribution && (
        <footer className="mt-4 text-sm text-muted-foreground">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}
