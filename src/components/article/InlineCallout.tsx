import { TrendingUp } from "lucide-react";

interface InlineCalloutProps {
  content: string;
}

export function InlineCallout({ content }: InlineCalloutProps) {
  return (
    <div className="my-8 p-4 sm:p-6 bg-surface border-l-4 border-primary rounded-r-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <p className="text-base sm:text-lg font-medium text-foreground">
          {content}
        </p>
      </div>
    </div>
  );
}
