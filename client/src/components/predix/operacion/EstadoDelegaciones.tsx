import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEstadoBadgeClass } from "@/lib/estadoSeverity";
import type { operationsData } from "@/lib/predixDemoData";

type EstadoDelegacionesProps = {
  delegations: (typeof operationsData)["delegationStatus"];
};

export function EstadoDelegaciones({ delegations }: EstadoDelegacionesProps) {
  return (
    <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Estado de delegaciones</h2>
          <p className="mt-1 text-sm text-muted-foreground">Indicadores relevantes para la coordinación diaria y reasignación de capacidad.</p>
        </div>
        <span className="text-xs font-bold text-muted-foreground">Corte: 17:30 h</span>
      </div>

      {/* Tabla real desde `sm` (640px) en adelante — el ancho mínimo que forzaba
          scroll horizontal en cualquier pantalla más angosta se quitó porque ya
          no aplica: bajo `sm` se muestra la lista de tarjetas de abajo en su
          lugar. Mismo patrón que predix/tablero/DesempenoDelegacion.tsx. */}
      <div className="mt-5 hidden overflow-x-auto sm:block">
        <table data-testid="delegacion-status-table" className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-[0.67rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              <th scope="col" className="pb-3">Delegación</th>
              <th scope="col" className="pb-3">Fila</th>
              <th scope="col" className="pb-3">Espera</th>
              <th scope="col" className="pb-3">Ocupación</th>
              <th scope="col" className="pb-3">Ventanillas</th>
              <th scope="col" className="pb-3 text-right">Condición</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {delegations.map((item) => (
              <tr key={item.name} data-testid="fila-delegacion" className="text-sm">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-extrabold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.city}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-bold text-foreground">{item.queue}</td>
                <td className="py-4 font-bold text-foreground">{item.wait} min</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${item.capacity >= 90 ? "bg-destructive" : item.capacity >= 80 ? "bg-chart-2" : "bg-success"}`} style={{ width: `${item.capacity}%` }} /></div>
                    <span className="text-xs font-bold text-muted-foreground">{item.capacity}%</span>
                  </div>
                </td>
                <td className="py-4 font-bold text-foreground">{item.counters}</td>
                <td className="py-4 text-right">
                  <Badge className={`rounded-full px-2.5 py-1 text-[0.67rem] font-bold ${getEstadoBadgeClass(item.status, { malos: ["Saturación"] })}`}>{item.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bajo `sm`: misma información sin tabla — una tarjeta apilada por
          delegación, cero scroll horizontal. */}
      <div data-testid="delegacion-status-movil" className="mt-5 space-y-2.5 sm:hidden">
        {delegations.map((item) => (
          <article key={item.name} data-testid="fila-delegacion-movil" className="rounded-xl border border-border p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-extrabold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.city}</p>
              </div>
              <Badge className={`shrink-0 rounded-full px-2.5 py-1 text-[0.67rem] font-bold ${getEstadoBadgeClass(item.status, { malos: ["Saturación"] })}`}>{item.status}</Badge>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Fila</p>
                <p className="text-sm font-bold text-foreground">{item.queue}</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Espera</p>
                <p className="text-sm font-bold text-foreground">{item.wait} min</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Ocupación</p>
                <p className="text-sm font-bold text-foreground">{item.capacity}%</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Ventanillas</p>
                <p className="text-sm font-bold text-foreground">{item.counters}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
