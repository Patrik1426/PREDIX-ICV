import { LineChart } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Period } from "./types";

type RevenuePoint = { month: string; actual: number; forecast: number };

type RecaudacionChartProps = {
  revenueTrend: readonly RevenuePoint[];
  period: Period;
};

const periodLabel: Record<Period, string> = {
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  ytd: "Acumulado anual",
};

export function RecaudacionChart({ revenueTrend, period }: RecaudacionChartProps) {
  const primero = revenueTrend[0];
  const ultimo = revenueTrend[revenueTrend.length - 1];

  return (
    <section data-testid="chart-recaudacion" className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" aria-hidden="true" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Recaudación y proyección</h2></div>
          <p className="mt-1 text-sm text-muted-foreground">Comportamiento mensual del ingreso, en millones de pesos.</p>
        </div>
        <span className="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">{periodLabel[period]}</span>
      </div>
      <p className="sr-only">
        Recaudación real y proyectada de {primero.month} a {ultimo.month}: cierra en ${ultimo.actual}M reales
        contra una proyección de ${ultimo.forecast}M.
      </p>
      <div className="mt-5 h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueTrend as RevenuePoint[]} margin={{ top: 10, right: 4, left: -17, bottom: 0 }}>
            <defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.01} /></linearGradient></defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid var(--color-border)", boxShadow: "var(--shadow-popover)" }} />
            <Legend wrapperStyle={{ paddingTop: 14, fontSize: 12 }} />
            <Area type="monotone" dataKey="actual" name="Recaudación" stroke="var(--color-primary)" strokeWidth={3} fill="url(#revenueFill)" />
            <Area type="monotone" dataKey="forecast" name="Proyección" stroke="var(--color-muted-foreground)" strokeWidth={2} fill="transparent" strokeDasharray="5 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
