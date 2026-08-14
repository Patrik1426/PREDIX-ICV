// ============================================================
// Citas — vista previa del módulo 03. Clic en un día abre el desglose de
// slots por hora. Corre sobre @/lib/demoData, nunca datos reales del ICVNL.
// ============================================================

import { useState } from "react";
import {
  DEMO_CITAS_SEMANA,
  DEMO_SLOTS_CITAS,
  DEMO_PROXIMAS_ATENCIONES,
  DEMO_CITAS_HOY_KPIS,
  DEMO_DEMANDA_HORARIA,
} from "@/lib/demoData";
import { KpiCard, DataRow } from "@/components/dashboard";
import { CalendarClock, Users2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PreviewCitas() {
  const [diaSeleccionado, setDiaSeleccionado] = useState(DEMO_CITAS_SEMANA[4].dia); // Viernes, pico

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={<CalendarClock className="h-4 w-4" />}
          label="Citas hoy"
          value={DEMO_CITAS_HOY_KPIS.citasHoy}
          colorClassName="text-chart-5"
          spark={DEMO_DEMANDA_HORARIA}
        />
        <KpiCard
          icon={<Users2 className="h-4 w-4" />}
          label="En espera"
          value={DEMO_CITAS_HOY_KPIS.enEspera}
          colorClassName="text-chart-5"
          spark={DEMO_DEMANDA_HORARIA}
        />
      </div>
      <div className="space-y-4">
      <div className="flex h-24 items-end gap-3">
        {DEMO_CITAS_SEMANA.map((c) => (
          <button
            key={c.dia}
            onClick={() => setDiaSeleccionado(c.dia)}
            className="flex flex-1 flex-col items-center gap-1 group"
          >
            <div
              className={cn(
                "w-full rounded-t-sm transition-colors",
                c.dia === diaSeleccionado ? "bg-primary" : "bg-chart-2 group-hover:opacity-80"
              )}
              style={{ height: `${Math.round(c.ocupacion * 100)}%` }}
            />
            <span className={cn("text-xs", c.dia === diaSeleccionado ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {c.dia}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="mb-2 text-xs font-medium">Slots del {diaSeleccionado} — ejemplo de distribución por hora</p>
        <div className="space-y-1.5">
          {DEMO_SLOTS_CITAS.map((s) => (
            <div key={s.hora} className="flex items-center gap-2 text-xs">
              <span className="w-14 shrink-0 text-muted-foreground">{s.hora}</span>
              <div className="flex h-4 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-chart-3"
                  style={{ width: `${(s.demandaWalkIn / s.capacidadTotal) * 100}%` }}
                  title="Walk-in"
                />
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(s.slotsCita / s.capacidadTotal) * 100}%` }}
                  title="Citas"
                />
              </div>
              <span className="w-20 shrink-0 text-right text-muted-foreground">{s.capacidadTotal} atn.</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-chart-3" /> Walk-in</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Con cita</span>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Próximas atenciones</h3>
        <div className="rounded-lg border bg-card px-4">
          {DEMO_PROXIMAS_ATENCIONES.map((a, i) => (
            <DataRow
              key={a.hora + a.nombre}
              icon={<Clock className="h-4 w-4" />}
              label={`${a.nombre} — ${a.tramite}`}
              value={`${a.hora} · ${a.estado}`}
              colorClassName="text-chart-5"
              last={i === DEMO_PROXIMAS_ATENCIONES.length - 1}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
