// ============================================================
// PrediccionDemanda — vista previa del módulo 01. Real vs. proyección +
// banda de incertidumbre, con lectura exacta al pasar el mouse. Sigue el
// patrón estándar para series de tiempo con predicción: trazo sólido =
// observado, punteado = proyectado. Corre sobre @/lib/demoData, nunca datos
// reales del ICVNL.
// ============================================================

import { useState } from "react";
import { DEMO_DEMANDA_HORARIA, DEMO_KPIS, DEMO_PRECISION_MODELO, DEMO_DELEGACIONES } from "@/lib/demoData";
import { KpiCard, ModuleHeader } from "@/components/dashboard";
import { CarrilFlujo } from "@/components/demo/DemoVisuals";
import { TrendingUp, Target } from "lucide-react";

const AHORA_INDEX = 9; // 9:00 — hora "actual" de la demo

export default function PreviewPrediccion() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const max = Math.max(...DEMO_DEMANDA_HORARIA);
  const points = DEMO_DEMANDA_HORARIA.map((v, i) => ({
    x: (i / (DEMO_DEMANDA_HORARIA.length - 1)) * 100,
    y: 100 - (v / max) * 100,
    v,
  }));
  const real = points.slice(0, AHORA_INDEX + 1);
  const forecast = points.slice(AHORA_INDEX);
  const band = forecast.map((p) => ({ x: p.x, hi: Math.max(0, p.y - 8), lo: Math.min(100, p.y + 8) }));
  const bandPath = band.map((p) => `${p.x},${p.hi}`).join(" ") + " " + [...band].reverse().map((p) => `${p.x},${p.lo}`).join(" ");
  const active = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Trámites proyectados hoy"
          value={DEMO_KPIS.tramitesProyectadosHoy}
          colorClassName="text-chart-1"
          spark={DEMO_DEMANDA_HORARIA}
        />
        <KpiCard
          icon={<Target className="h-4 w-4" />}
          label="Precisión del modelo"
          value={DEMO_PRECISION_MODELO}
          suffix="%"
          colorClassName="text-chart-1"
          spark={DEMO_DEMANDA_HORARIA}
        />
      </div>
      <div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-32 w-full cursor-crosshair overflow-visible"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          const i = Math.round(ratio * (points.length - 1));
          setHoverIndex(Math.min(Math.max(i, 0), points.length - 1));
        }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <polygon points={bandPath} fill="var(--chart-1)" fillOpacity="0.12" />
        <polyline
          points={real.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={forecast.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          strokeDasharray="5,4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {active && (
          <>
            <line x1={active.x} y1="0" x2={active.x} y2="100" stroke="currentColor" strokeOpacity="0.15" vectorEffect="non-scaling-stroke" />
            <circle cx={active.x} cy={active.y} r="2.2" fill="var(--chart-1)" vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>
      <div className="mt-2 flex h-5 items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {active
            ? `${hoverIndex}:00 · ${active.v} trámites/h${hoverIndex! > AHORA_INDEX ? " (proyectado)" : ""}`
            : "Pasa el mouse sobre la curva"}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-4 border-t-2 border-chart-1" /> Real (hasta las 9:00)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-4 border-t-2 border-dashed border-chart-1" /> Proyección
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-chart-1/15" /> Incertidumbre
        </span>
      </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <ModuleHeader eyebrow="Proyección por ubicación" title="Ocupación por delegación" />
        <div className="space-y-2.5">
          {DEMO_DELEGACIONES.map((d) => (
            <CarrilFlujo key={d.nombre} {...d} />
          ))}
        </div>
      </div>
    </div>
  );
}
