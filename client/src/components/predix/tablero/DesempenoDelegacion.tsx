import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { getEstadoBadgeClass } from "@/lib/estadoSeverity";
import type { Delegation } from "./types";

type DelegationRow = { name: string; demand: number; wait: number; capacity: number; status: string };

type DesempenoDelegacionProps = {
  delegations: readonly DelegationRow[];
  filter: Delegation;
};

export function DesempenoDelegacion({ delegations, filter }: DesempenoDelegacionProps) {
  return (
    <section className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Desempeño por delegación</h2>
          <p className="mt-1 text-sm text-muted-foreground">Lectura comparativa de carga y nivel de servicio.</p>
        </div>
        <Link
          href="/modulos/citas_operacion"
          data-testid="desempeno-ver-operacion"
          className="flex shrink-0 items-center whitespace-nowrap text-xs font-bold text-primary"
        >
          Ver operación <ChevronRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      {/* Tabla real desde `sm` (640px) en adelante — el ancho mínimo que forzaba
          scroll horizontal en cualquier pantalla más angosta se quitó porque ya
          no aplica: bajo `sm` se muestra la lista de tarjetas de abajo en su lugar. */}
      <div className="mt-4 hidden overflow-x-auto sm:block">
        <table data-testid="tabla-desempeno" className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              <th scope="col" className="pb-3">Delegación</th>
              <th scope="col" className="pb-3">Demanda</th>
              <th scope="col" className="pb-3">Espera</th>
              <th scope="col" className="pb-3">Capacidad</th>
              <th scope="col" className="pb-3 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {delegations.filter((item) => filter === "todas" || item.name === filter).map((item) => (
              <tr key={item.name} data-testid="fila-delegacion" className="text-sm">
                <td className="py-3.5 font-extrabold text-foreground">{item.name}</td>
                <td className="py-3.5 font-bold tabular-nums text-muted-foreground">{item.demand}%</td>
                <td className="py-3.5 font-bold tabular-nums text-muted-foreground">{item.wait} min</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-muted-foreground" style={{ width: `${item.capacity}%` }} /></div>
                    <span className="text-xs font-bold tabular-nums text-muted-foreground">{item.capacity}%</span>
                  </div>
                </td>
                <td className="py-3.5 text-right"><Badge className={`rounded-full px-2.5 py-1 text-[0.66rem] font-bold ${getEstadoBadgeClass(item.status)}`}>{item.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bajo `sm`: misma información, sin tabla — cada delegación como tarjeta
          apilada, cero scroll horizontal. */}
      <div data-testid="tabla-desempeno-movil" className="mt-4 space-y-2.5 sm:hidden">
        {delegations.filter((item) => filter === "todas" || item.name === filter).map((item) => (
          <article key={item.name} data-testid="fila-delegacion-movil" className="rounded-xl border border-border p-3.5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-extrabold text-foreground">{item.name}</p>
              <Badge className={`shrink-0 rounded-full px-2.5 py-1 text-[0.66rem] font-bold ${getEstadoBadgeClass(item.status)}`}>{item.status}</Badge>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Demanda</p>
                <p className="text-sm font-bold tabular-nums text-foreground">{item.demand}%</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Espera</p>
                <p className="text-sm font-bold tabular-nums text-foreground">{item.wait} min</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Capacidad</p>
                <p className="text-sm font-bold tabular-nums text-foreground">{item.capacity}%</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
