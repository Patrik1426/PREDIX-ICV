import { ArrowRight, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type EvidenceItem = {
  id: string;
  segment: string;
  indicator: string;
  sources: readonly { name: string }[];
  signal: string;
  intervention: string;
};

type CrucesEvidenciaProps = {
  evidence: readonly EvidenceItem[];
};

export function CrucesEvidencia({ evidence }: CrucesEvidenciaProps) {
  return (
    <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Cruces demostrativos de evidencia</h2>
          <p className="mt-1 text-sm text-muted-foreground">Las relaciones muestran cómo la evidencia de distintas fuentes sustenta una intervención; no contienen datos personales ni resultados oficiales.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {evidence.map((item) => (
          <article key={item.id} data-testid="cruce-item" className="rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-primary">Segmento</p>
                <h3 className="mt-1 font-extrabold text-foreground">{item.segment}</h3>
              </div>
              <Badge className="rounded-full bg-success/10 text-[0.64rem] font-bold text-success hover:bg-success/10">{item.indicator}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {item.sources.map((source, index) => (
                <div key={source.name} className="flex items-center gap-1.5">
                  {index > 0 ? <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" /> : null}
                  <span className="rounded-md bg-muted px-2 py-1 text-[0.65rem] font-extrabold text-foreground">{source.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-5 text-muted-foreground">{item.signal}</p>
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Intervención sugerida</p>
              <p className="mt-1 text-sm font-bold leading-5 text-foreground">{item.intervention}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
