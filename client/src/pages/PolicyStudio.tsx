// ============================================================
// PolicyStudio — página nueva, portada de predix-icvnl (PolicyStudio.tsx),
// recoloreada a tokens ICVNL. Sin RBAC slug propio — visible a cualquier
// usuario autenticado (ver AppShell.tsx). 100% dato de ejemplo sin ancla
// real en el ICVNL — DemoNotice es la etiqueta honesta, mismo criterio
// que las otras páginas de este port. Ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// ============================================================

import { DemoNotice } from "@/components/predix/DemoNotice";
import { PageHeader } from "@/components/predix/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { policyData } from "@/lib/predixDemoData";
import { buildPolicyEvidence, simulateDiscountPolicy } from "@/lib/policySimulacion";
import { ArrowRight, CalendarDays, CheckCircle2, DatabaseZap, Landmark, Link2, Network, SlidersHorizontal, UsersRound } from "lucide-react";
import { useState } from "react";

type SegmentFilter = "todos" | "regularizacion" | "acceso" | "atencion";

const sourceColors: Record<string, string> = {
  orange: "border-chart-1/30 bg-chart-1/10 text-chart-1",
  navy: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  gold: "border-chart-3/30 bg-chart-3/10 text-chart-3",
  teal: "border-chart-4/30 bg-chart-4/10 text-chart-4",
  purple: "border-chart-5/30 bg-chart-5/10 text-chart-5",
};

export default function PolicyStudio() {
  const [discount, setDiscount] = useState(6);
  const [segment, setSegment] = useState<SegmentFilter>("todos");
  const data = policyData;
  const simulation = simulateDiscountPolicy(discount);
  const evidence = buildPolicyEvidence(segment, data.sources);

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader
        eyebrow="Diseño de política pública"
        title="De la señal de datos a la intervención pública"
        description="Cruce de fuentes institucionales, segmentación poblacional y simulación de acciones para mejorar recaudo, acceso y eficiencia de atención."
        action={<Button className="rounded-xl bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90"><DatabaseZap className="mr-2 h-4 w-4" />Nueva hipótesis</Button>}
      />
      <DemoNotice text={data.notice} />

      {segment === "todos" && (
        <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-[0_8px_25px_rgba(21,33,58,.035)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Network className="h-4 w-4" /></span>
            <span>Lente de priorización</span>
          </div>
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <span className="sr-only">Segmento de política</span>
            <select value={segment} onChange={(e) => setSegment(e.target.value as SegmentFilter)} className="mt-1 h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-bold normal-case tracking-normal text-foreground outline-none focus:border-primary">
              <option value="todos">Todos los segmentos</option>
              <option value="regularizacion">Regularización pendiente</option>
              <option value="acceso">Barreras de acceso</option>
              <option value="atencion">Atención preferente</option>
            </select>
          </label>
        </section>
      )}

      <section className="rounded-[1.4rem] border border-border bg-card p-5 shadow-[0_10px_35px_rgba(21,33,58,0.04)] sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Malla de evidencia institucional</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fuentes gobernadas que pueden enriquecer decisiones, bajo convenios y reglas de uso aplicables.</p>
          </div>
          <Badge className="w-fit rounded-full bg-success/10 px-3 py-1.5 text-xs font-bold text-success hover:bg-success/10"><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />5 fuentes mapeadas</Badge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {data.sources.map((source) => (
            <article key={source.code} className={`rounded-2xl border p-4 ${sourceColors[source.color]}`}>
              <div className="flex items-center justify-between"><Landmark className="h-4 w-4 opacity-70" /></div>
              <h3 className="mt-4 font-extrabold text-foreground">{source.name}</h3>
              <p className="mt-1.5 min-h-12 text-xs leading-5 text-muted-foreground">{source.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-current/10 pt-3 text-[0.67rem] font-bold"><span>{source.status}</span><span className="opacity-75">{source.cadence}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 shadow-[0_10px_35px_rgba(21,33,58,.04)] sm:p-6">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          <div>
            <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Cruces demostrativos de evidencia</h2>
            <p className="mt-1 text-sm text-muted-foreground">Las relaciones muestran cómo la evidencia de distintas fuentes sustenta una intervención; no contienen datos personales ni resultados oficiales.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          {evidence.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-primary">Segmento</p><h3 className="mt-1 font-extrabold text-foreground">{item.segment}</h3></div>
                <Badge className="rounded-full bg-success/10 text-[0.64rem] font-bold text-success hover:bg-success/10">{item.indicator}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {item.sources.map((source, index) => (
                  <div key={source.name} className="flex items-center gap-1.5">
                    {index > 0 ? <ArrowRight className="h-3 w-3 text-muted-foreground" /> : null}
                    <span className="rounded-md bg-muted px-2 py-1 text-[0.65rem] font-extrabold text-foreground">{source.name}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-5 text-muted-foreground">{item.signal}</p>
              <div className="mt-4 border-t border-border pt-3"><p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Intervención sugerida</p><p className="mt-1 text-sm font-bold leading-5 text-foreground">{item.intervention}</p></div>
            </article>
          ))}
        </div>
      </section>

      <div className={`mt-5 grid gap-5 ${segment === "todos" ? "xl:grid-cols-[.88fr_1.12fr]" : ""}`}>
        <section className="rounded-[1.4rem] bg-foreground p-5 text-background sm:p-6">
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-primary">Simulador de política</p>
          <h2 className="mt-2 text-xl font-extrabold tracking-[-0.04em]">Descuento escalonado de refrendo</h2>
          <p className="mt-2 text-sm leading-6 text-background/70">Explora un incentivo de referencia. La estimación se actualiza con supuestos demostrativos y debe validarse antes de su uso operativo.</p>
          <div className="mt-7">
            <div className="flex items-end justify-between"><p className="text-sm font-bold">Incentivo propuesto</p><p className="text-3xl font-extrabold tracking-[-0.06em] text-primary">{discount}%</p></div>
            <input aria-label="Porcentaje de descuento" type="range" min="0" max="15" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-background/20 accent-primary" />
            <div className="mt-1.5 flex justify-between text-[0.68rem] font-semibold text-background/60"><span>0%</span><span>15%</span></div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-background/[0.08] p-3.5"><p className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-background/60">Conclusión esperada</p><p className="mt-1.5 text-2xl font-extrabold">{simulation.expectedCompletionPct}%</p></div>
            <div className="rounded-xl bg-background/[0.08] p-3.5"><p className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-background/60">Recaudación estimada</p><p className="mt-1.5 text-2xl font-extrabold">${simulation.projectedRevenueMillions} M</p></div>
          </div>
          <p className="mt-4 rounded-xl border border-background/10 bg-background/[0.04] p-3 text-xs leading-5 text-background/80">{simulation.recommendation}</p>
        </section>
        {segment === "todos" && (
          <section className="rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Segmentos priorizables</h2></div>
            <div className="mt-4 space-y-3">
              {data.segments.map((item) => (
                <article key={item.title} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-extrabold text-foreground">{item.title}</h3>
                    <Badge className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${item.priority === "Alta" ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-muted text-muted-foreground hover:bg-muted"}`}>Prioridad {item.priority}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.context}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground"><span>{item.population}</span><span className="text-chart-3">{item.sources}</span></div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Portafolio de intervenciones</h2></div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {data.opportunities.map((opportunity) => (
            <article key={opportunity.id} className="flex flex-col rounded-2xl border border-border p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-[0_12px_26px_rgba(21,33,58,.06)]">
              <div className="flex items-start justify-between gap-3"><CalendarDays className="h-5 w-5 text-primary" /><Badge variant="outline" className="rounded-full text-[0.65rem] font-bold text-muted-foreground">{opportunity.tag}</Badge></div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{opportunity.type}</p>
              <h3 className="mt-1.5 font-extrabold leading-5 text-foreground">{opportunity.title}</h3>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">{opportunity.detail}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-extrabold text-success">{opportunity.impact}</span>
                <Button variant="ghost" size="sm" className="h-auto px-0 text-xs font-bold text-primary hover:bg-transparent hover:text-primary/80">Ver diseño <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
