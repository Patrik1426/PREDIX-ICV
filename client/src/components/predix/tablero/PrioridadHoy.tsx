import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PrioridadHoy() {
  return (
    <section className="relative overflow-hidden rounded-[1.55rem] bg-foreground px-5 py-6 text-background shadow-[var(--shadow-lg)] sm:px-7">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />PRIORIDAD ESTRATÉGICA DEL DÍA</div>
          <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-[-0.05em] sm:text-3xl">Amortiguar el pico en Guadalupe antes de las 11:00 h.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-background/70">La señal predictiva sugiere una reasignación temporal de capacidad y canalización de citas flexibles para preservar el nivel de servicio.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Badge className="rounded-full bg-background/10 px-3 py-1.5 text-xs font-bold text-background hover:bg-background/10"><ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-primary" aria-hidden="true" />Riesgo controlable</Badge>
          <Button data-testid="prioridad-cta" className="rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary/90">Ver recomendación <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" /></Button>
        </div>
      </div>
    </section>
  );
}
