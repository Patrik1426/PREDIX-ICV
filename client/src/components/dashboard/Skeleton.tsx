import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-5">
      <Skeleton className="mb-3 h-3 w-2/5" />
      <Skeleton className="mb-2 h-7 w-[70%]" />
      <Skeleton className="h-2.5 w-[55%]" />
    </div>
  );
}

export function SkeletonKpi() {
  return (
    <div className="flex min-h-[148px] flex-col rounded-lg border bg-card p-5">
      <Skeleton className="h-[34px] w-[34px] rounded-[9px]" />
      <div className="mt-auto pt-6">
        <Skeleton className="mb-2 h-8 w-[60%]" />
        <Skeleton className="h-3 w-[45%]" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 py-2">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={cn("h-3.5", j === 0 ? "flex-[2]" : "flex-1")} />
          ))}
        </div>
      ))}
    </div>
  );
}
