// ============================================================
// AsignadorVentanillas — vista previa del módulo 02. Cambia de escenario y
// ve la reasignación de ventanillas en vivo. Corre sobre @/lib/demoData,
// nunca datos reales del ICVNL.
//
// "Como PREDIX" (2026-08-20): "Capacidad vs. demanda por hora" es un
// ComposedChart real (recharts, mismo patrón que Tendencia semanal del
// Tablero) — capacidad constante (DEMO_VENTANILLAS.length × 15/h,
// throughput ilustrativo ~4 min/trámite) contra la curva de demanda ya
// existente, mostrando dónde la demanda supera la capacidad instalada.
// "Comparativo de escenarios" muestra los 3 DEMO_ESCENARIOS_ASIGNACION
// lado a lado (antes solo se veía uno a la vez, alternando con los chips).
// ============================================================

import { useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import { DEMO_ESCENARIOS_ASIGNACION, DEMO_VENTANILLAS, DEMO_KPIS, DEMO_DEMANDA_HORARIA, DEMO_MATRIZ_COMPETENCIAS } from "@/lib/demoData";
import { KpiCard, ModuleHeader, DataRow } from "@/components/dashboard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DoorOpen, Timer, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const CAPACIDAD_POR_VENTANILLA_HORA = 15; // ~4 min/trámite, ilustrativo
const CAPACIDAD_HORA = DEMO_VENTANILLAS.length * CAPACIDAD_POR_VENTANILLA_HORA;

const CAPACIDAD_CONFIG = {
  demanda: { label: "Demanda", color: "var(--chart-1)" },
  capacidad: { label: "Capacidad instalada", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const capacidadVsDemandaData = DEMO_DEMANDA_HORARIA.map((v, hora) => ({
  hora: `${hora}h`,
  demanda: v,
  capacidad: CAPACIDAD_HORA,
}));

export default function PreviewAsignador() {
  const [escenarioId, setEscenarioId] = useState<(typeof DEMO_ESCENARIOS_ASIGNACION)[number]["id"]>(
    DEMO_ESCENARIOS_ASIGNACION[0].id
  );
  const escenario = DEMO_ESCENARIOS_ASIGNACION.find((e) => e.id === escenarioId)!;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={<DoorOpen className="h-4 w-4" />}
          label="Ventanillas activas"
          value={DEMO_VENTANILLAS.length}
          colorClassName="text-chart-2"
          spark={DEMO_DEMANDA_HORARIA}
        />
        <KpiCard
          icon={<Timer className="h-4 w-4" />}
          label="Tiempo de espera actual"
          value={DEMO_KPIS.tiempoEsperaPromedioMin}
          suffix=" min"
          colorClassName="text-chart-2"
          spark={DEMO_DEMANDA_HORARIA}
        />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <ModuleHeader
          eyebrow={`${DEMO_VENTANILLAS.length} ventanillas × ${CAPACIDAD_POR_VENTANILLA_HORA}/h — capacidad instalada`}
          title="Capacidad vs. demanda por hora"
        />
        <ChartContainer config={CAPACIDAD_CONFIG} className="h-48 w-full">
          <ComposedChart data={capacidadVsDemandaData} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hora" tickLine={false} axisLine={false} tickMargin={8} interval={2} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="demanda" fill="var(--color-demanda)" radius={3} />
            <Line
              dataKey="capacidad"
              stroke="var(--color-capacidad)"
              strokeWidth={2}
              strokeDasharray="4,3"
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </div>

      <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {DEMO_ESCENARIOS_ASIGNACION.map((e) => (
          <button
            key={e.id}
            onClick={() => setEscenarioId(e.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              e.id === escenarioId
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {e.etiqueta}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {escenario.ventanillas.map((v) => (
          <div key={v.ventanilla} className="flex items-center gap-3">
            <span className="w-7 text-sm font-medium text-muted-foreground">{v.ventanilla}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${Math.round(v.carga * 100)}%` }}
              />
            </div>
            <span className="w-32 truncate text-right text-xs text-muted-foreground">{v.tramite}</span>
          </div>
        ))}
      </div>

      <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Acción del sistema: </span>
        {escenario.accion}
      </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <ModuleHeader eyebrow="Carga (%) de cada ventanilla, los 3 escenarios a la vez" title="Comparativo de escenarios" />
        <div className="overflow-x-auto">
          <table aria-label="Comparativo de escenarios" className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-1.5 pr-3 font-medium">Ventanilla</th>
                {DEMO_ESCENARIOS_ASIGNACION.map((e) => (
                  <th key={e.id} className="px-2 py-1.5 font-medium">
                    {e.etiqueta}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_VENTANILLAS.map((v) => (
                <tr key={v.ventanilla} className="border-b last:border-0">
                  <td className="py-1.5 pr-3 font-medium text-foreground">{v.ventanilla}</td>
                  {DEMO_ESCENARIOS_ASIGNACION.map((e) => {
                    const cell = e.ventanillas.find((ev) => ev.ventanilla === v.ventanilla);
                    return (
                      <td key={e.id} className={cn("px-2 py-1.5 tabular-nums", e.id === escenarioId && "font-semibold text-primary")}>
                        {cell ? `${Math.round(cell.carga * 100)}%` : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border bg-card px-4">
        <div className="pt-4">
          <ModuleHeader eyebrow="Quién puede cubrir cada ventanilla" title="Matriz de competencias" />
        </div>
        {DEMO_MATRIZ_COMPETENCIAS.map((c, i) => (
          <DataRow
            key={c.empleado}
            icon={<UserRound className="h-4 w-4" />}
            label={c.empleado}
            value={c.tramites.join(", ")}
            colorClassName="text-chart-2"
            last={i === DEMO_MATRIZ_COMPETENCIAS.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
