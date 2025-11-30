export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[50vh] lg:h-[65vh] bg-surface animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="h-6 w-20 bg-muted rounded" />
            <div className="h-12 w-3/4 bg-muted rounded" />
            <div className="h-6 w-1/2 bg-muted rounded" />
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-full bg-surface rounded animate-pulse" />
            <div className="h-6 w-full bg-surface rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-surface rounded animate-pulse" />
            <div className="h-6 w-full bg-surface rounded animate-pulse" />
            <div className="h-6 w-5/6 bg-surface rounded animate-pulse" />
          </div>

          {/* Sidebar Skeleton */}
          <div className="hidden lg:block space-y-6">
            <div className="h-48 w-full bg-surface rounded-xl animate-pulse" />
            <div className="h-64 w-full bg-surface rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
