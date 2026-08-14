import { useCounter } from "@/hooks/useCounter";
import { cn } from "@/lib/utils";

function KpiSparkline({ values, className }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map(
    (v, i) => `${(i / (values.length - 1)) * 200},${42 - ((v - min) / range) * 36 - 3}`
  );
  const area = `0,42 ${points.join(" ")} 200,42`;
  return (
    <svg
      className={cn("absolute inset-x-0 bottom-0 opacity-50", className)}
      style={{ height: 42 }}
      viewBox="0 0 200 42"
      preserveAspectRatio="none"
    >
      <polygon points={area} className="fill-current" fillOpacity={0.14} />
      <polyline points={points.join(" ")} fill="none" className="stroke-current" strokeWidth={1.5} />
    </svg>
  );
}

export function KpiCard({
  icon,
  label,
  value,
  suffix,
  colorClassName,
  spark,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  colorClassName: string;
  spark: number[];
  delta?: React.ReactNode;
}) {
  const display = useCounter(value);
  return (
    <div className="relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border bg-current/[0.14] border-current/30",
            colorClassName
          )}
        >
          {icon}
        </span>
        {delta}
      </div>
      <div className={colorClassName}>
        <div className="font-mono text-2xl font-medium leading-none">
          {display.toLocaleString()}
          {suffix && <span className="text-base text-muted-foreground">{suffix}</span>}
        </div>
        <div className="mt-1.5 text-base font-semibold text-foreground">{label}</div>
      </div>
      <KpiSparkline values={spark} className={colorClassName} />
    </div>
  );
}
