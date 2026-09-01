import { Network } from "lucide-react";
import type { SegmentFilter } from "./types";

type LenteFiltroProps = {
  segment: SegmentFilter;
  onSegmentChange: (segment: SegmentFilter) => void;
};

export function LenteFiltro({ segment, onSegmentChange }: LenteFiltroProps) {
  return (
    <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Network className="h-4 w-4" aria-hidden="true" /></span>
        <span>Lente de priorización</span>
      </div>
      <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
        <span className="sr-only">Segmento de política</span>
        <select
          value={segment}
          onChange={(e) => onSegmentChange(e.target.value as SegmentFilter)}
          data-testid="filtro-segmento"
          className="mt-1 h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-bold normal-case tracking-normal text-foreground outline-none focus:border-primary"
        >
          <option value="todos">Todos los segmentos</option>
          <option value="regularizacion">Regularización pendiente</option>
          <option value="acceso">Barreras de acceso</option>
          <option value="atencion">Atención preferente</option>
        </select>
      </label>
    </section>
  );
}
