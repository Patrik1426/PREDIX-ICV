import { CheckCircle2, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Source = { code: string; name: string; description: string; status: string; cadence: string; color: string };

type MallaEvidenciaProps = {
  sources: readonly Source[];
};

const sourceColors: Record<string, string> = {
  orange: "border-chart-1/30 bg-chart-1/10 text-chart-1",
  navy: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  gold: "border-chart-3/30 bg-chart-3/10 text-chart-3",
  teal: "border-chart-4/30 bg-chart-4/10 text-chart-4",
  purple: "border-chart-5/30 bg-chart-5/10 text-chart-5",
};

export function MallaEvidencia({ sources }: MallaEvidenciaProps) {
  return (
    <section className="rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Malla de evidencia institucional</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fuentes gobernadas que pueden enriquecer decisiones, bajo convenios y reglas de uso aplicables.</p>
        </div>
        <Badge className="w-fit rounded-full bg-success/10 px-3 py-1.5 text-xs font-bold text-success hover:bg-success/10">
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />5 fuentes mapeadas
        </Badge>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {sources.map((source) => (
          <article key={source.code} data-testid="fuente-item" className={`rounded-2xl border p-4 ${sourceColors[source.color]}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-[0.16em]">{source.code}</span>
              <Landmark className="h-4 w-4 opacity-70" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-extrabold text-foreground">{source.name}</h3>
            <p className="mt-1.5 min-h-12 text-xs leading-5 text-muted-foreground">{source.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-current/10 pt-3 text-[0.67rem] font-bold">
              <span>{source.status}</span>
              <span className="opacity-75">{source.cadence}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
