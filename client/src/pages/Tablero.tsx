// ============================================================
// Tablero — landing post-login de PREDIX-ICV. Responde los 4 verbos de la
// sección 6.3 de la propuesta (ver, anticipar, planificar, demostrar): KPIs
// de éxito del proyecto vs. meta (sección 8), comparativo por delegación,
// tendencia semanal, fuentes de datos reales (sección 5.1) y un reporteador
// real (CSV, sección 9.2). Todo corre sobre @/lib/demoData y
// @/lib/proposalData — nunca datos reales del ICVNL. Ver
// docs/superpowers/specs/2026-08-17-consolidacion-3-modulos-design.md y
// docs/superpowers/specs/2026-08-18-plan-negocio-icvnl.md.
// ============================================================

import { Link } from "wouter";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { DEMO_DELEGACIONES, DEMO_CITAS_SEMANA } from "@/lib/demoData";
import { KPIS_EXITO_PROYECTO, RESULTADOS_ESPERADOS } from "@/lib/proposalData";
import { DataRow, ModuleHeader } from "@/components/dashboard";
import { BulletKpi, DatoEjemplo } from "@/components/demo/DemoVisuals";
import DelegacionesMap from "@/components/demo/DelegacionesMap";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import ReportExporter, { type ReportRow } from "@/components/ReportExporter";
import { Database, ArrowRight } from "lucide-react";

const TENDENCIA_CONFIG = {
  ocupacion: { label: "Ocupación", color: "var(--chart-2)" },
} satisfies ChartConfig;

const FUENTES_DE_DATOS = [
  "Portal icvnl.gob.mx",
  "NL en Línea (nlinea.nl.gob.mx)",
  "App ICVNL",
  "Sistema de turnos en delegación",
  "Base de datos vehicular",
  "Sistema de pagos",
];

export default function Tablero() {
  const delegacionTop = [...DEMO_DELEGACIONES].sort((a, b) => b.ocupacion - a.ocupacion)[0];
  const delegacionesSaturadas = DEMO_DELEGACIONES.filter((d) => d.estado === "saturado").sort(
    (a, b) => b.ocupacion - a.ocupacion
  );
  const tendenciaData = DEMO_CITAS_SEMANA.map((d) => ({
    dia: d.dia,
    ocupacion: Math.round(d.ocupacion * 100),
  }));

  const reportRows: ReportRow[] = [
    ...KPIS_EXITO_PROYECTO.conBullet.map((k) => ({
      metrica: k.label,
      valor: `${k.actual}${k.unidad} (línea base) / meta ${k.meta}${k.unidad}`,
    })),
    ...KPIS_EXITO_PROYECTO.soloMeta.map((k) => ({
      metrica: k.label,
      valor: k.metaTexto,
    })),
  ];

  return (
    <div className="container py-10 space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Tablero</h1>
        <p className="mt-1 text-muted-foreground">
          Indicadores de éxito del proyecto, comparativo por delegación y fuentes de datos.{" "}
          <Link href="/propuesta" className="underline underline-offset-2 hover:text-foreground">
            Ver propuesta completa
          </Link>
        </p>
      </section>

      {/* Hero — tesis del Tablero: el dato titular del Resumen Ejecutivo de la
          propuesta (RESULTADOS_ESPERADOS[0]), no un KPI genérico. Da el "para
          qué" antes de entrar al detalle línea-base/meta de abajo. */}
      <section className="rounded-lg border bg-card p-6">
        <p className="text-xs text-muted-foreground">Meta del proyecto — resumen ejecutivo</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-7xl font-bold tracking-tight text-primary">
            {RESULTADOS_ESPERADOS[0].cambio}
          </span>
          <span className="text-lg font-medium text-foreground">
            en {RESULTADOS_ESPERADOS[0].metrica.toLowerCase()}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {RESULTADOS_ESPERADOS[0].detalle} — meta a 12 meses (sección 8, detalle abajo).
        </p>
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-6">
        <ModuleHeader
          eyebrow="Sección 8 de la propuesta"
          title="Indicadores de éxito — línea base vs. meta (12 meses)"
        />
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {KPIS_EXITO_PROYECTO.conBullet.map((k) => (
            <BulletKpi key={k.label} {...k} />
          ))}
        </div>
        <div className="grid gap-2 border-t pt-4 sm:grid-cols-2">
          {KPIS_EXITO_PROYECTO.soloMeta.map((k) => (
            <div key={k.label} className="flex items-baseline justify-between text-xs">
              <span className="font-medium text-foreground">{k.label}</span>
              <span className="tabular-nums text-muted-foreground">Meta: {k.metaTexto}</span>
            </div>
          ))}
        </div>
        {delegacionesSaturadas.length > 0 && (
          <p className="border-t pt-3 text-xs text-muted-foreground">
            Delegaciones en estado saturado (presionan estos indicadores más que el promedio
            estatal):{" "}
            {delegacionesSaturadas.map((d, i) => (
              <span key={d.nombre} className="font-medium text-foreground">
                {d.nombre} ({Math.round(d.ocupacion * 100)}%)
                {i < delegacionesSaturadas.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        )}
      </section>

      <section className="rounded-lg border bg-card p-6">
        <ModuleHeader eyebrow="Sección 6.3 — ver" title="Comparativo por delegación" action={<DatoEjemplo />} />
        <DelegacionesMap />
        <p className="mt-2 text-xs text-muted-foreground">
          "Monterrey Centro" usa el polígono completo del municipio de Monterrey — "Centro" es una
          zona interna, no un municipio propio.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Mayor demanda proyectada: <span className="font-semibold text-foreground">{delegacionTop.nombre}</span>.{" "}
          <Link
            href="/modulos/prediccion_asignacion"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Ver Predicción y Asignación <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </section>

      <section className="rounded-lg border bg-card p-6">
        <ModuleHeader eyebrow="Sección 4 — anticipar" title="Tendencia semanal" />
        <ChartContainer config={TENDENCIA_CONFIG} className="h-56 w-full">
          <BarChart data={tendenciaData} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={(value) => `${value}% de ocupación`} />}
            />
            <Bar dataKey="ocupacion" fill="var(--color-ocupacion)" radius={4} />
          </BarChart>
        </ChartContainer>
      </section>

      {/* Fuentes de datos + Reporteador: utilitarias, no contenido primario — sin card
          bordeada propia para que Hero/Indicadores/Mapa/Tendencia destaquen por
          jerarquía real en vez de 6 cajas idénticas. */}
      <section className="border-t pt-6">
        <ModuleHeader eyebrow="Sección 5.1" title="Fuentes de datos" />
        <div>
          {FUENTES_DE_DATOS.map((nombre, i) => (
            <DataRow
              key={nombre}
              icon={<Database className="h-4 w-4" />}
              label={nombre}
              value="Planeado"
              colorClassName="text-muted-foreground"
              last={i === FUENTES_DE_DATOS.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="space-y-2 border-t pt-6">
        <ModuleHeader eyebrow="Sección 9.2 — demostrar" title="Reporteador" action={<ReportExporter rows={reportRows} />} />
        <p className="text-sm text-muted-foreground">
          Exporta los indicadores de éxito del proyecto a CSV. Los valores de línea base son
          los de la propuesta original, no mediciones en vivo del ICVNL.
        </p>
      </section>
    </div>
  );
}
