import { ArrowUpRight } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  change: string;
  detail: string;
  trend: string;
  tone: "orange" | "navy" | "green" | "purple";
};

const toneStyles = {
  orange: "bg-primary/10 text-primary",
  navy: "bg-muted text-foreground",
  green: "bg-success/10 text-success",
  purple: "bg-chart-5/10 text-chart-5",
};

export function MetricCard({ label, value, change, detail, tone }: MetricCardProps) {
  return (
    <article className="rounded-[1.35rem] border border-border bg-card p-5 shadow-[0_10px_35px_rgba(21,33,58,0.045)] transition-transform duration-200 hover:-translate-y-0.5">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[1.75rem] font-extrabold tracking-[-0.055em] text-foreground">{value}</p>
        <span className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${toneStyles[tone]}`}>
          <ArrowUpRight className="h-3.5 w-3.5" />
          {change}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </article>
  );
}
