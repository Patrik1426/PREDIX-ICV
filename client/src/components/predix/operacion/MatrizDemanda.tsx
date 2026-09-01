import { Clock3 } from "lucide-react";
import { getDelegationHeatValue, heatColor } from "./heatmap";
import type { operationsData } from "@/lib/predixDemoData";

type MatrizDemandaProps = {
  hourlyHeat: (typeof operationsData)["hourlyHeat"];
  locations: readonly string[];
};

// Convertido de una grilla de <div> a una <table> real (2026-08-31) — la
// matriz de calor tiene 28 celdas (7 franjas × 4 delegaciones), por encima
// del umbral donde ui-ux-pro-max recomienda un heatmap sobre barras, pero su
// propia guía de accesibilidad para heatmaps pide "downloadable grid table
// with row/column labels" como alternativa — semántica real de tabla en vez
// de una grilla puramente visual.
export function MatrizDemanda({ hourlyHeat, locations }: MatrizDemandaProps) {
  return (
    // min-w-0: sin esto, la tabla interna (min-w-[560px], dentro de su propio
    // overflow-x-auto) empuja el track del grid padre a su mismo ancho en vez
    // de dejar que el scroll interno la contenga — bug preexistente (ya en el
    // div-grid original antes de este refactor), mismo patrón ya corregido en
    // predix/tablero/AlertasPanel.tsx y DesempenoDelegacion.tsx.
    <section className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Matriz de demanda por franja horaria</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Intensidad relativa de llegada de personas por delegación.</p>
      <div className="mt-5 overflow-x-auto">
        <table data-testid="matriz-demanda" className="w-full min-w-[560px] border-separate border-spacing-2">
          <thead>
            <tr>
              <th scope="col" className="w-[70px]"><span className="sr-only">Hora</span></th>
              {locations.map((location) => (
                <th key={location} scope="col" className="px-2 text-center text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                  {location}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hourlyHeat.map((row) => (
              <tr key={row.hour}>
                <th scope="row" className="pr-2 text-left text-xs font-bold text-muted-foreground">{row.hour}:00</th>
                {locations.map((location) => {
                  const value = getDelegationHeatValue(row, location);
                  return (
                    <td key={location} className={`h-10 rounded-lg text-center text-xs font-extrabold ${heatColor(value)}`}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-end gap-3 text-[0.66rem] font-semibold text-muted-foreground">
        <span>Baja</span>
        <span className="h-2 w-7 rounded-full bg-success/15" aria-hidden="true" />
        <span className="h-2 w-7 rounded-full bg-chart-2/30" aria-hidden="true" />
        <span className="h-2 w-7 rounded-full bg-destructive" aria-hidden="true" />
        <span>Alta</span>
      </div>
    </section>
  );
}
