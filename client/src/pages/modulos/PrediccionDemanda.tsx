// ============================================================
// PrediccionDemanda — vista previa del módulo 01. Real vs. proyección +
// banda de incertidumbre, con lectura exacta al pasar el mouse. Sigue el
// patrón estándar para series de tiempo con predicción: trazo sólido =
// observado, punteado = proyectado. Corre sobre @/lib/demoData, nunca datos
// reales del ICVNL.
//
// "Como PREDIX" (2026-08-20): "Ocupación por delegación" pasa de una lista
// de barras de texto al mapa Leaflet real (DelegacionesMap, mismo
// componente del Tablero) — reuso directo, sin duplicar lógica de mapa.
// Se agrega "Desglose por tipo de trámite" (DEMO_DEMANDA_POR_TRAMITE,
// proporciones fijas sobre la curva agregada) con un ForecastChart
// compacto por trámite — mismo componente compartido de DemoVisuals.tsx.
// ============================================================

import { useState } from "react";
import { DEMO_DEMANDA_HORARIA, DEMO_KPIS, DEMO_PRECISION_MODELO, DEMO_DEMANDA_POR_TRAMITE } from "@/lib/demoData";
import { KpiCard, ModuleHeader } from "@/components/dashboard";
import { ForecastChart } from "@/components/demo/DemoVisuals";
import DelegacionesMap from "@/components/demo/DelegacionesMap";
import { TrendingUp, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const AHORA_INDEX = 9; // 9:00 — hora "actual" de la demo
const HORAS_EJE = [0, 6, 12, 18, 23]; // grid recesivo, no una etiqueta por hora
const GRID_Y = [25, 50, 75]; // líneas horizontales de referencia (viewBox 0-100)

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
  // Tooltip flotante: el viewBox 0-100 mapea 1:1 a % del contenedor, así que
  // la posición del punto activo ya es un porcentaje válido de left/top —
  // no hace falta medir el DOM.
  const tooltipSide = active && active.x > 70 ? "left" : "right";

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
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-36 w-full cursor-crosshair overflow-visible"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            const i = Math.round(ratio * (points.length - 1));
            setHoverIndex(Math.min(Math.max(i, 0), points.length - 1));
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Grid recesivo — sin esto la curva flota sin ningún punto de referencia visual. */}
          {GRID_Y.map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          ))}
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
              <circle cx={active.x} cy={active.y} r="2.6" fill="var(--card)" stroke="var(--chart-1)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </>
          )}
        </svg>

        {/* Eje de horas — recesivo, solo unas pocas marcas (no una por hora). */}
        <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
          {HORAS_EJE.map((h) => (
            <span
              key={h}
              className="absolute -translate-x-1/2 tabular-nums"
              style={{ left: `${(h / (points.length - 1)) * 100}%` }}
            >
              {h}h
            </span>
          ))}
        </div>

        {/* Tooltip flotante — sigue al punto activo, nunca tapa la curva
            porque cambia de lado (izq/der) según en qué mitad está el punto. */}
        {active && (
          <div
            className={cn(
              "pointer-events-none absolute top-0 z-10 -translate-y-1/2 whitespace-nowrap rounded-lg border bg-card px-2.5 py-1.5 text-xs shadow-md",
              tooltipSide === "left" ? "-translate-x-full" : ""
            )}
            style={{
              left: `${active.x}%`,
              top: `${active.y}%`,
              marginLeft: tooltipSide === "left" ? "-10px" : "10px",
            }}
          >
            <p className="font-mono font-semibold text-foreground">{active.v} trámites/h</p>
            <p className="text-muted-foreground">
              {hoverIndex}:00{hoverIndex! > AHORA_INDEX ? " · proyectado" : " · real"}
            </p>
          </div>
        )}
      </div>
      <div className="mt-1 flex h-4 items-center text-xs text-muted-foreground">
        {!active && "Pasa el mouse sobre la curva para ver el detalle por hora"}
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
        <DelegacionesMap />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <ModuleHeader eyebrow="Misma curva agregada, separada por tipo de trámite" title="Desglose por tipo de trámite" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DEMO_DEMANDA_POR_TRAMITE.map((t) => (
            <div key={t.tramite} className="rounded-lg border bg-muted/20 p-3">
              <p className="mb-1 text-xs font-medium text-foreground">{t.tramite}</p>
              <ForecastChart values={t.valores} nowIndex={AHORA_INDEX} className="h-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
