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
//
// Curva principal migrada a recharts (mismo día): el SVG a mano ya tenía
// grid/eje/tooltip, pero seguía siendo una línea delgada sin peso visual.
// Pasa a área rellena (ComposedChart, misma familia de componente que
// "Capacidad vs. demanda" en AsignadorVentanillas.tsx) — misma serie real
// vs. proyectada (mismo hue --chart-1, solo el trazo cambia sólido/
// punteado, nunca dos colores para una sola entidad) más una segunda Area
// de rango [lo,hi] para la banda de incertidumbre.
// ============================================================

import { Area, CartesianGrid, ComposedChart, XAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { DEMO_DEMANDA_HORARIA, DEMO_KPIS, DEMO_PRECISION_MODELO, DEMO_DEMANDA_POR_TRAMITE } from "@/lib/demoData";
import { KpiCard, ModuleHeader } from "@/components/dashboard";
import { ForecastChart } from "@/components/demo/DemoVisuals";
import DelegacionesMap from "@/components/demo/DelegacionesMap";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { TrendingUp, Target } from "lucide-react";

const AHORA_INDEX = 9; // 9:00 — hora "actual" de la demo

const CURVA_CONFIG = {
  real: { label: "Real", color: "var(--chart-1)" },
  proyeccion: { label: "Proyección", color: "var(--chart-1)" },
} satisfies ChartConfig;

const curvaData = DEMO_DEMANDA_HORARIA.map((v, hora) => {
  const esProyeccion = hora >= AHORA_INDEX;
  const margen = Math.round(v * 0.12); // ±12%, ilustrativo — mismo criterio que el resto del demo
  return {
    hora,
    // AHORA_INDEX aparece en AMBAS series a propósito — es el punto donde
    // el área "real" termina y "proyección" empieza; sin este punto
    // compartido, recharts dibuja dos polígonos que no se tocan y deja un
    // hueco en blanco de una hora completa entre los dos rellenos.
    real: hora <= AHORA_INDEX ? v : null,
    proyeccion: esProyeccion ? v : null,
    banda: esProyeccion ? ([Math.max(0, v - margen), v + margen] as [number, number]) : null,
  };
});

function CurvaTooltip({ active, payload, label }: TooltipProps<number, string>) {
  const punto = payload?.find((p) => (p.dataKey === "real" || p.dataKey === "proyeccion") && p.value != null);
  if (!active || !punto) return null;
  const esProyeccion = punto.dataKey === "proyeccion";
  return (
    <div className="whitespace-nowrap rounded-lg border bg-card px-2.5 py-1.5 text-xs shadow-md">
      <p className="font-mono font-semibold text-foreground">{punto.value} trámites/h</p>
      <p className="text-muted-foreground">
        {label}:00 · {esProyeccion ? "proyectado" : "real"}
      </p>
    </div>
  );
}

export default function PreviewPrediccion() {
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
      <ChartContainer config={CURVA_CONFIG} className="h-40 w-full">
        <ComposedChart data={curvaData} margin={{ left: -20, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hora"
            tickFormatter={(h) => `${h}h`}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={[0, 6, 12, 18, 23]}
            interval={0}
          />
          <ChartTooltip cursor={{ stroke: "var(--border)", strokeWidth: 1 }} content={<CurvaTooltip />} />
          <Area dataKey="banda" fill="var(--color-real)" fillOpacity={0.12} stroke="none" isAnimationActive={false} />
          <Area
            dataKey="real"
            fill="var(--color-real)"
            fillOpacity={0.15}
            stroke="var(--color-real)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
          <Area
            dataKey="proyeccion"
            fill="var(--color-proyeccion)"
            fillOpacity={0.15}
            stroke="var(--color-proyeccion)"
            strokeWidth={2.5}
            strokeDasharray="5,4"
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
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
