import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrendBadge({ value, goodDown = true }: { value: number; goodDown?: boolean }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <Minus size={11} /> 0%
      </span>
    );
  }
  const up = value > 0;
  const bad = goodDown ? up : !up;
  const colorClassName = bad ? "text-status-saturado bg-status-saturado/10" : "text-status-fluido bg-status-fluido/10";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", colorClassName)}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {Math.abs(value)}%
    </span>
  );
}
