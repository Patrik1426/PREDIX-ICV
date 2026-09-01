import { MapPinned } from "lucide-react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DemandItem = { type: string; value: number; color: string };

type DemandaChartProps = {
  demandMix: readonly DemandItem[];
};

export function DemandaChart({ demandMix }: DemandaChartProps) {
  const mayor = demandMix.reduce((top, item) => (item.value > top.value ? item : top), demandMix[0]);

  return (
    <section data-testid="chart-demanda" className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-primary" aria-hidden="true" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Demanda por trámite</h2></div>
      <p className="mt-1 text-sm text-muted-foreground">Distribución acumulada del periodo.</p>
      <p className="sr-only">
        Distribución de demanda por trámite: {demandMix.map((item) => `${item.type} ${item.value}%`).join(", ")}.
      </p>
      <div className="mt-5 h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={demandMix as DemandItem[]} layout="vertical" margin={{ top: 0, right: 28, left: 15, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 600 }} width={114} />
            <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
            <Bar dataKey="value" name="Participación" radius={[0, 7, 7, 0]}>
              {demandMix.map((entry) => <Cell key={entry.type} fill={entry.color} />)}
              <LabelList dataKey="value" position="right" formatter={(v: number) => `${v}%`} fill="var(--color-muted-foreground)" fontSize={11} fontWeight={700} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-between border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
        <span>Mayor presión: {mayor.type}</span>
        <span className="text-primary">{mayor.value}% del volumen</span>
      </div>
    </section>
  );
}
