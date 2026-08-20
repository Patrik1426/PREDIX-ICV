// ============================================================
// Monitor — vista previa del módulo 04. Kit operativo: ring de estado,
// KPIs, ventanillas. Corre sobre @/lib/demoData, nunca datos reales del
// ICVNL.
//
// El "Panel de Indicadores Clave" de la sección 3.4 de la propuesta define
// 8 KPIs; aquí se muestran los 6 que tienen dato demo real y honesto
// (tiempo de espera, trámites hoy, tiempo de atención, trámites
// completados/hora — suma real de las ventanillas activas —, ocupación de
// ventanillas y ciudadanos en fila, en el centro del ring). Los 2 restantes
// (predicción de saturación, tasa de abandono) y el "mapa de calor
// operativo" de esa misma sección no tienen dato demo real que respaldarlos
// — no se fabrican, quedan pendientes hasta tener datos reales del ICVNL.
//
// Interactivo (2026-08-20, mismo patrón que AsignadorVentanillas): chips de
// escenario (DEMO_ESCENARIOS_MONITOR) cambian la carga base del panel; cada
// VentanillaCard se puede marcar "fuera de servicio", recalculando trámites
// completados/hora en vivo. "temporada_alta" cita el +1000% real reportado
// por el ICVNL en el cuestionario (docs/CUESTIONARIO_RESPUESTAS_ICVNL.md).
//
// "Se siente vivo" (2026-08-20): el mismo ciclo de 2.2s que ya movía el
// ring con jitter ahora también hace avanzar "atendidos" — cada 3 ticks
// (~6.6s), UNA ventanilla activa (turno rotativo, nunca una fuera de
// servicio) suma 1 trámite. Determinista (turno por índice, no
// Math.random()) a propósito: se puede testear con timers falsos sin
// volverse un test frágil por aleatoriedad.
// ============================================================

import { useEffect, useState } from "react";
import { DEMO_ESTADO_FILA, DEMO_DEMANDA_HORARIA, DEMO_VENTANILLAS_MONITOR, DEMO_ESCENARIOS_MONITOR } from "@/lib/demoData";
import { KpiCard, TrendBadge, DataRow, StatusRing, VentanillaCard, SkeletonKpi } from "@/components/dashboard";
import { AlertTriangle, Timer, Users2, Gauge, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PreviewMonitor() {
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [escenarioId, setEscenarioId] = useState<(typeof DEMO_ESCENARIOS_MONITOR)[number]["id"]>(
    DEMO_ESCENARIOS_MONITOR[0].id
  );
  const [ventanillas, setVentanillas] = useState(() =>
    DEMO_VENTANILLAS_MONITOR.map((v) => ({ ...v, activa: true }))
  );

  useEffect(() => {
    const initial = setTimeout(() => setLoading(false), 600);
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (tick === 0 || tick % 3 !== 0) return;
    setVentanillas((vs) => {
      const activos = vs.reduce<number[]>((acc, v, i) => (v.activa ? [...acc, i] : acc), []);
      if (activos.length === 0) return vs;
      const turno = activos[(tick / 3 - 1) % activos.length];
      return vs.map((v, i) => (i === turno ? { ...v, atendidos: v.atendidos + 1 } : v));
    });
  }, [tick]);

  const escenario = DEMO_ESCENARIOS_MONITOR.find((e) => e.id === escenarioId)!;
  const jitter = Math.sin(tick) * 4;
  const capacidadPct = Math.min(97, Math.max(8, escenario.capacidadPct + jitter));
  const tramitesCompletadosHora = ventanillas
    .filter((v) => v.activa)
    .reduce((sum, v) => sum + v.atendidos, 0);

  const toggleVentanilla = (ventanilla: string) =>
    setVentanillas((vs) => vs.map((v) => (v.ventanilla === ventanilla ? { ...v, activa: !v.activa } : v)));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chart-4" />
        Simulando actualización cada 2s
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {DEMO_ESCENARIOS_MONITOR.map((e) => (
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
        {escenario.nota && (
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">{escenario.nota}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 sm:flex-row sm:justify-around">
        <StatusRing
          value={capacidadPct}
          label="ESPERANDO"
          centerValue={String(escenario.esperando)}
        />
        <div className="grid flex-1 grid-cols-2 gap-3">
          {loading ? (
            <>
              <SkeletonKpi />
              <SkeletonKpi />
            </>
          ) : (
            <>
              <KpiCard
                icon={<Timer className="h-4 w-4" />}
                label="Tiempo de espera"
                value={escenario.tiempoEsperaPromedioMin}
                suffix=" min"
                colorClassName="text-primary"
                spark={DEMO_DEMANDA_HORARIA}
                delta={<TrendBadge value={4} />}
              />
              <KpiCard
                icon={<Users2 className="h-4 w-4" />}
                label="Trámites hoy"
                value={escenario.tramitesProyectadosHoy}
                colorClassName="text-chart-2"
                spark={DEMO_DEMANDA_HORARIA}
                delta={<TrendBadge value={-2} goodDown={false} />}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {loading ? (
          <>
            <SkeletonKpi />
            <SkeletonKpi />
            <SkeletonKpi />
          </>
        ) : (
          <>
            <KpiCard
              icon={<Timer className="h-4 w-4" />}
              label="Tiempo de atención"
              value={DEMO_ESTADO_FILA.tiempoEstimadoMin}
              suffix=" min"
              colorClassName="text-chart-3"
              spark={DEMO_DEMANDA_HORARIA}
            />
            <KpiCard
              icon={<DoorOpen className="h-4 w-4" />}
              label="Trámites completados/hora"
              value={tramitesCompletadosHora}
              colorClassName="text-chart-2"
              spark={DEMO_DEMANDA_HORARIA}
            />
            <KpiCard
              icon={<Gauge className="h-4 w-4" />}
              label="Ocupación de ventanillas"
              value={Math.round(escenario.capacidadPct)}
              suffix="%"
              colorClassName="text-primary"
              spark={DEMO_DEMANDA_HORARIA}
            />
          </>
        )}
      </div>

      <div className="rounded-lg border bg-card p-4">
        <DataRow
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Trámites de registro vehicular presentan retrasos > 25 min"
          value="Cuello de botella"
          colorClassName="text-status-saturado"
          last
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Ventanillas activas</h3>
        <div className="space-y-2">
          {ventanillas.map((v) => (
            <VentanillaCard
              key={v.ventanilla}
              ventanilla={v.ventanilla}
              operador={v.operador}
              tramite={v.tramite}
              tiempoMin={v.tiempoMin}
              atendidos={v.atendidos}
              estado={v.activa ? v.estado : "fuera_servicio"}
              onToggleServicio={() => toggleVentanilla(v.ventanilla)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
