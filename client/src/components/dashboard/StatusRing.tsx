import { cn } from "@/lib/utils";

function statusColorClassName(value: number): string {
  if (value <= 60) return "text-status-fluido";
  if (value <= 85) return "text-status-presion";
  return "text-status-saturado";
}

export function StatusRing({
  value,
  label,
  centerValue,
  size = 160,
}: {
  value: number;
  label: string;
  centerValue: string;
  size?: number;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const colorClassName = statusColorClassName(clamped);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} className="fill-none stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("fill-none stroke-current transition-all duration-500 ease-out", colorClassName)}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-3xl font-bold leading-none text-foreground">{centerValue}</span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
