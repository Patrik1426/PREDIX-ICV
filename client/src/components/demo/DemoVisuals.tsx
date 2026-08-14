// ============================================================
// DemoVisuals — piezas visuales reutilizables para ilustrar cómo se vería
// cada módulo de PREDIX-ICV. Todo lo que dibujan viene de @/lib/demoData,
// datos de ejemplo, nunca operación real del ICVNL.
//
// Los colores usan las variables del tema (--chart-1..5), nunca literales
// oklch() sueltos, para que se adapten correctamente en modo oscuro.
// ============================================================

import { cn } from "@/lib/utils";
import type { DEMO_DELEGACIONES } from "@/lib/demoData";

const ESTADO_COLOR: Record<string, string> = {
  fluido: "bg-success",
  moderado: "bg-chart-2",
  saturado: "bg-destructive",
};

export function DatoEjemplo() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
      Datos de ejemplo
    </span>
  );
}

export function MetaDelProyecto() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      Meta del proyecto — Propuesta PREDIX-ICV, jul 2026
    </span>
  );
}

export function CarrilFlujo({ nombre, ocupacion, estado }: (typeof DEMO_DELEGACIONES)[number]) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">{nombre}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", ESTADO_COLOR[estado])}
          style={{ width: `${Math.round(ocupacion * 100)}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {Math.round(ocupacion * 100)}%
      </span>
    </div>
  );
}

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const max = Math.max(...values);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("h-16 w-full overflow-visible", className)}>
      <polyline
        points={points}
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * ForecastChart — curva "real" (sólida) hasta la hora actual + proyección
 * (punteada) con banda de incertidumbre, siguiendo el patrón estándar para
 * series de tiempo con predicción: la leyenda distingue por trazo, no solo
 * por color, para que sea legible sin depender del color.
 */
export function ForecastChart({ values, nowIndex, className }: { values: number[]; nowIndex: number; className?: string }) {
  const max = Math.max(...values);
  const toXY = (i: number, v: number) => ({ x: (i / (values.length - 1)) * 100, y: 100 - (v / max) * 100 });
  const real = values.slice(0, nowIndex + 1).map((v, i) => toXY(i, v));
  const forecast = values.slice(nowIndex).map((v, i) => toXY(i + nowIndex, v));
  const band = forecast.map((p) => ({ ...p, hi: Math.max(0, p.y - 8), lo: Math.min(100, p.y + 8) }));
  const bandPath =
    band.map((p) => `${p.x},${p.hi}`).join(" ") + " " + [...band].reverse().map((p) => `${p.x},${p.lo}`).join(" ");

  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("w-full overflow-visible", className)}>
        <polygon points={bandPath} fill="var(--chart-1)" fillOpacity="0.12" />
        <polyline
          points={real.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={forecast.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2"
          strokeDasharray="5,4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={real[real.length - 1].x} cy={real[real.length - 1].y} r="2" fill="var(--chart-1)" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-4 border-t-2 border-chart-1" /> Real (hasta ahora)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-4 border-t-2 border-dashed border-chart-1" /> Proyección
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-chart-1/15" /> Banda de incertidumbre
        </span>
      </div>
    </div>
  );
}

/**
 * BulletKpi — barra compacta de "real vs. meta", con el valor siempre
 * visible como texto (no solo al pasar el mouse) para accesibilidad.
 */
export function BulletKpi({
  label,
  actual,
  meta,
  max,
  unidad = "",
  menorEsMejor = true,
}: {
  label: string;
  actual: number;
  meta: number;
  max: number;
  unidad?: string;
  menorEsMejor?: boolean;
}) {
  const cumple = menorEsMejor ? actual <= meta : actual >= meta;
  const actualPct = Math.min(100, (actual / max) * 100);
  const metaPct = Math.min(100, (meta / max) * 100);

  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {actual}
          {unidad} real · meta {meta}
          {unidad}
        </span>
      </div>
      <div className="relative mt-1.5 h-2 rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", cumple ? "bg-primary" : "bg-chart-2")}
          style={{ width: `${actualPct}%` }}
        />
        <div className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 bg-foreground" style={{ left: `${metaPct}%` }} />
      </div>
    </div>
  );
}
