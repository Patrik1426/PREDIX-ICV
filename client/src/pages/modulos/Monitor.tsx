// ============================================================
// Monitor — vista previa del módulo 04. Kit operativo: ring de estado,
// KPIs, ventanillas. Corre sobre @/lib/demoData, nunca datos reales del
// ICVNL.
// ============================================================

import { useEffect, useState } from "react";
import { DEMO_ESTADO_FILA, DEMO_KPIS, DEMO_DEMANDA_HORARIA, DEMO_VENTANILLAS_MONITOR } from "@/lib/demoData";
import { KpiCard, TrendBadge, DataRow, StatusRing, VentanillaCard, SkeletonKpi } from "@/components/dashboard";
import { AlertTriangle, Timer, Users2 } from "lucide-react";

export default function PreviewMonitor() {
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initial = setTimeout(() => setLoading(false), 600);
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, []);

  const jitter = Math.sin(tick) * 4;
  const capacidadPct = Math.min(97, Math.max(8, DEMO_ESTADO_FILA.capacidadPct + jitter));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chart-4" />
        Simulando actualización cada 2s
      </div>

      <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 sm:flex-row sm:justify-around">
        <StatusRing
          value={capacidadPct}
          label="ESPERANDO"
          centerValue={String(DEMO_ESTADO_FILA.esperando)}
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
                value={DEMO_KPIS.tiempoEsperaPromedioMin}
                suffix=" min"
                colorClassName="text-primary"
                spark={DEMO_DEMANDA_HORARIA}
                delta={<TrendBadge value={4} />}
              />
              <KpiCard
                icon={<Users2 className="h-4 w-4" />}
                label="Trámites hoy"
                value={DEMO_KPIS.tramitesProyectadosHoy}
                colorClassName="text-chart-2"
                spark={DEMO_DEMANDA_HORARIA}
                delta={<TrendBadge value={-2} goodDown={false} />}
              />
            </>
          )}
        </div>
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
          {DEMO_VENTANILLAS_MONITOR.map((v) => (
            <VentanillaCard key={v.ventanilla} {...v} />
          ))}
        </div>
      </div>
    </div>
  );
}
