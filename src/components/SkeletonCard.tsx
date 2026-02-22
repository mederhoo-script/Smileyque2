export default function SkeletonCard() {
    return (
        <div className="flex flex-col bg-card border border-border rounded-sm overflow-hidden animate-pulse">
            {/* Image placeholder */}
            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                <div className="absolute inset-0 skeleton-shimmer" />
            </div>
            {/* Content placeholder */}
            <div className="p-4 flex flex-col gap-3">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="flex items-center justify-between mt-1">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-8 bg-muted rounded w-16" />
                </div>
            </div>
        </div>
    );
}
