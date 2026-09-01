import { ArrowRight, CalendarDays, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Opportunity = { id: string; tag: string; type: string; title: string; detail: string; impact: string };

type PortafolioIntervencionesProps = {
  opportunities: readonly Opportunity[];
};

export function PortafolioIntervenciones({ opportunities }: PortafolioIntervencionesProps) {
  return (
    <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Portafolio de intervenciones</h2>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => (
          <article
            key={opportunity.id}
            data-testid="oportunidad-item"
            className="flex flex-col rounded-2xl border border-border p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-start justify-between gap-3">
              <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
              <Badge variant="outline" className="rounded-full text-[0.65rem] font-bold text-muted-foreground">{opportunity.tag}</Badge>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{opportunity.type}</p>
            <h3 className="mt-1.5 font-extrabold leading-5 text-foreground">{opportunity.title}</h3>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">{opportunity.detail}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-extrabold text-success">{opportunity.impact}</span>
              <Button
                variant="ghost"
                size="sm"
                data-testid="oportunidad-ver-diseno"
                className="h-auto px-0 text-xs font-bold text-primary hover:bg-transparent hover:text-primary/80"
              >
                Ver diseño <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
