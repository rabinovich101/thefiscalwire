"use client";

import { useParams } from "next/navigation";
import { MessageSquare } from "lucide-react";

export default function ConversationsPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();

  return (
    <div className="space-y-6">
      <section className="bg-surface rounded-xl border border-border/50 p-12">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">Conversations</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Community discussions for {symbol} are coming soon. This feature will allow investors
            to share insights and discuss the latest news and analysis.
          </p>
          <div className="pt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Coming Soon
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
