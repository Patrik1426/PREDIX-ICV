import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { operationsData } from "@/lib/predixDemoData";

type IncidenciasProps = {
  incidents: (typeof operationsData)["incidents"];
};

export function Incidencias({ incidents }: IncidenciasProps) {
  return (
    <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Incidencias y señales de operación</h2>
      </div>
      <div className="mt-4 divide-y divide-border">
        {incidents.map((incident) => (
          <article key={`${incident.time}-${incident.delegation}`} data-testid="incidencia-item" className="grid gap-2 py-4 first:pt-0 sm:grid-cols-[64px_150px_1fr_auto] sm:items-center">
            <p className="text-sm font-extrabold text-primary">{incident.time}</p>
            <div><p className="font-bold text-foreground">{incident.delegation}</p><p className="text-xs text-muted-foreground">{incident.type}</p></div>
            <p className="text-sm leading-5 text-muted-foreground">{incident.detail}</p>
            <Badge variant="outline" className="w-fit text-[0.67rem] font-bold text-muted-foreground">{incident.owner}</Badge>
          </article>
        ))}
      </div>
    </section>
  );
}
