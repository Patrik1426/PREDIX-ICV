import { Filter } from "lucide-react";
import type { Delegation, Period } from "./types";

type FiltrosAnalisisProps = {
  period: Period;
  onPeriodChange: (period: Period) => void;
  delegation: Delegation;
  onDelegationChange: (delegation: Delegation) => void;
  delegaciones: readonly string[];
};

export function FiltrosAnalisis({ period, onPeriodChange, delegation, onDelegationChange, delegaciones }: FiltrosAnalisisProps) {
  return (
    <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Filter className="h-4 w-4" aria-hidden="true" /></span>
        <span>Filtros de análisis</span>
      </div>
      <div className="grid gap-2 sm:flex">
        <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          <span className="sr-only">Periodo</span>
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as Period)}
            data-testid="filtro-periodo"
            className="mt-1 h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-bold normal-case tracking-normal text-foreground outline-none focus:border-primary"
          >
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="ytd">Acumulado anual</option>
          </select>
        </label>
        <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          <span className="sr-only">Delegación</span>
          <select
            value={delegation}
            onChange={(e) => onDelegationChange(e.target.value as Delegation)}
            data-testid="filtro-delegacion"
            className="mt-1 h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-bold normal-case tracking-normal text-foreground outline-none focus:border-primary"
          >
            <option value="todas">Todas las delegaciones</option>
            {delegaciones.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
