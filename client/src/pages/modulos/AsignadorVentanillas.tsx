// ============================================================
// AsignadorVentanillas — vista previa del módulo 02. Cambia de escenario y
// ve la reasignación de ventanillas en vivo. Corre sobre @/lib/demoData,
// nunca datos reales del ICVNL.
// ============================================================

import { useState } from "react";
import { DEMO_ESCENARIOS_ASIGNACION, DEMO_VENTANILLAS, DEMO_KPIS, DEMO_DEMANDA_HORARIA, DEMO_MATRIZ_COMPETENCIAS } from "@/lib/demoData";
import { KpiCard, ModuleHeader, DataRow } from "@/components/dashboard";
import { DoorOpen, Timer, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

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
