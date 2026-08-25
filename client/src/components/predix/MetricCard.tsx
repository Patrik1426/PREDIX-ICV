import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  change: string;
  detail: string;
  trend: string;
  tone: "orange" | "navy" | "green" | "purple";
};

const toneStyles = {
  orange: "bg-primary/10 text-primary",
  navy: "bg-muted text-foreground",
  green: "bg-success/10 text-success",
  purple: "bg-chart-5/10 text-chart-5",
};

export function MetricCard({ label, value, change, detail, tone }: MetricCardProps) {
  // La flecha sigue el signo real del cambio, no el sentimiento: "-2.7 min" es
  // una mejora (tone verde) pero numéricamente baja, y pintarla con flecha
  // ascendente contradecía el dato. El color sigue expresando si es bueno o malo.
  const baja = change.trim().startsWith("-");
  const Flecha = baja ? ArrowDownRight : ArrowUpRight;

  return (
    <article className="rounded-[1.35rem] border border-border bg-card p-5 shadow-[0_10px_35px_rgba(21,33,58,0.045)] transition-transform duration-200 hover:-translate-y-0.5">
      {/* min-h reserva 2 líneas de etiqueta para que los valores queden alineados
          entre tarjetas aunque una etiqueta ocupe 1 línea y otra 2. */}
      <p className="min-h-[2.1rem] text-[0.68rem] font-extrabold uppercase leading-[1.05rem] tracking-[0.14em] text-muted-foreground">{label}</p>
      {/* flex-wrap: el badge se acomoda junto al valor cuando hay espacio y baja
          a su propia línea cuando no — antes se encimaba y recortaba el borde. */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="text-[1.75rem] font-extrabold tabular-nums tracking-[-0.055em] text-foreground">{value}</p>
        <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${toneStyles[tone]}`}>
          <Flecha className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="sr-only">{baja ? "Disminución de" : "Aumento de"}</span>
          {change}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
    </article>
  );
}
