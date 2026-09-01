import { UserRoundCheck } from "lucide-react";
import { getDelegationHeatValue } from "./heatmap";
import type { operationsData } from "@/lib/predixDemoData";

type AccionSugeridaProps = {
  delegationStatus: (typeof operationsData)["delegationStatus"];
  drivers: (typeof operationsData)["userExperience"]["drivers"];
  hourlyHeat: (typeof operationsData)["hourlyHeat"];
};

export function AccionSugerida({ delegationStatus, drivers, hourlyHeat }: AccionSugeridaProps) {
  // Derivado en vivo de los mismos datos que ya alimentan "Estado de
  // delegaciones" y "Atributos evaluados" — antes era un párrafo fijo que
  // coincidía con el dato de ejemplo actual por casualidad, no por cálculo
  // (mismo criterio que "Mayor presión: Refrendo" en DemandaChart.tsx/Tablero).
  const topDelegation = [...delegationStatus].sort((a, b) => b.capacity - a.capacity)[0];
  const frictionDriver = [...drivers].sort((a, b) => a.value - b.value)[0];
  const peakHours = hourlyHeat
    .filter((row) => getDelegationHeatValue(row, topDelegation.name) >= 90)
    .map((row) => row.hour);
  const peakWindow = peakHours.length > 0
    ? `${peakHours[0]}:00 y ${peakHours[peakHours.length - 1]}:00 h`
    : "las horas de mayor flujo";

  return (
    <section data-testid="accion-sugerida" className="min-w-0 rounded-[1.4rem] bg-accent p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <UserRoundCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-extrabold tracking-[-0.03em] text-accent-foreground">Acción sugerida</h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-accent-foreground/80">
        La capacidad de {topDelegation.name} se acerca al límite ({topDelegation.capacity}%) entre {peakWindow}. Las
        encuestas también señalan "{frictionDriver.label}" como principal fricción (calificación {frictionDriver.value}%),
        por lo que se recomienda activar personal multitrámite y transferir citas flexibles a la franja vespertina.
      </p>
      <div className="mt-5 rounded-xl border border-border bg-card/60 p-4">
        <p className="text-[0.67rem] font-extrabold uppercase tracking-[0.12em] text-primary">Respuesta operativa</p>
        <p className="mt-2 text-2xl font-extrabold tracking-[-0.045em] text-accent-foreground">+2 ventanillas</p>
        <p className="mt-1 text-xs leading-5 text-accent-foreground/70">Preasignación recomendada durante la ventana crítica — cifra ilustrativa, no calculada.</p>
      </div>
    </section>
  );
}
