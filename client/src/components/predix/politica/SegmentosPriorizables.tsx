import { UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Segment = { title: string; priority: string; context: string; population: string; sources: string };

type SegmentosPriorizablesProps = {
  segments: readonly Segment[];
};

export function SegmentosPriorizables({ segments }: SegmentosPriorizablesProps) {
  return (
    <section className="rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <UsersRound className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Segmentos priorizables</h2>
      </div>
      <div className="mt-4 space-y-3">
        {segments.map((item) => (
          <article key={item.title} data-testid="segmento-item" className="rounded-xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-extrabold text-foreground">{item.title}</h3>
              <Badge className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${item.priority === "Alta" ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-muted text-muted-foreground hover:bg-muted"}`}>
                Prioridad {item.priority}
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{item.context}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground">
              <span>{item.population}</span>
              <span className="text-chart-3">{item.sources}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
