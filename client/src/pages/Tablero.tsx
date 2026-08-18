// ============================================================
// Tablero — landing post-login de PREDIX-ICV. Responde "para qué me sirve
// esto" a nivel dirección: KPIs, de dónde vienen los datos, un reporteador
// real (CSV) y un resumen de IA/predicción. Todo corre sobre
// @/lib/demoData — nunca datos reales del ICVNL. Ver
// docs/superpowers/specs/2026-08-17-consolidacion-3-modulos-design.md.
// ============================================================

import { Link } from "wouter";
import { DEMO_KPIS, DEMO_PRECISION_MODELO, DEMO_DELEGACIONES, DEMO_DEMANDA_HORARIA } from "@/lib/demoData";
import { KpiCard, DataRow, ModuleHeader } from "@/components/dashboard";
import ReportExporter, { type ReportRow } from "@/components/ReportExporter";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Timer, CalendarCheck, AlertTriangle, Target, Database, Sparkles, ArrowRight } from "lucide-react";

const FUENTES_DE_DATOS = [
  { nombre: "Asistente IA (Gemini)", estado: "real" as const },
  { nombre: "Sistema de Citas ICVNL", estado: "pendiente" as const },
  { nombre: "Sensores de ventanilla", estado: "pendiente" as const },
];

export default function Tablero() {
  const delegacionTop = [...DEMO_DELEGACIONES].sort((a, b) => b.ocupacion - a.ocupacion)[0];

  const reportRows: ReportRow[] = [
    { metrica: "Tiempo de espera promedio (min)", valor: String(DEMO_KPIS.tiempoEsperaPromedioMin) },
    { metrica: "Trámites proyectados hoy", valor: String(DEMO_KPIS.tramitesProyectadosHoy) },
    { metrica: "Trámites con cita previa (%)", valor: String(DEMO_KPIS.tramitesConCitaPct) },
    { metrica: "Delegaciones en alerta", valor: String(DEMO_KPIS.delegacionesEnAlerta) },
    { metrica: "Precisión del modelo (%)", valor: String(DEMO_PRECISION_MODELO) },
  ];

  return (
    <div className="container py-10 space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Tablero</h1>
        <p className="mt-1 text-muted-foreground">
          Vista general para dirección — KPIs, fuentes de datos, reportes y predicción.{" "}
          <Link href="/propuesta" className="underline underline-offset-2 hover:text-foreground">
            Ver propuesta completa
          </Link>
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading eyebrow="KPIs" title="Indicadores generales (datos de ejemplo)" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            icon={<Timer className="h-4 w-4" />}
            label="Tiempo de espera"
            value={DEMO_KPIS.tiempoEsperaPromedioMin}
            suffix=" min"
            colorClassName="text-primary"
            spark={DEMO_DEMANDA_HORARIA}
          />
          <KpiCard
            icon={<CalendarCheck className="h-4 w-4" />}
            label="Con cita previa"
            value={DEMO_KPIS.tramitesConCitaPct}
            suffix="%"
            colorClassName="text-chart-5"
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
          <KpiCard
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Delegaciones en alerta"
            value={DEMO_KPIS.delegacionesEnAlerta}
            colorClassName="text-chart-4"
            spark={DEMO_DEMANDA_HORARIA}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border bg-card p-5">
          <ModuleHeader eyebrow="Conexiones" title="Fuentes de datos" />
          <div>
            {FUENTES_DE_DATOS.map((f, i) => (
              <DataRow
                key={f.nombre}
                icon={<Database className="h-4 w-4" />}
                label={f.nombre}
                value={f.estado === "real" ? "Conectado" : "Pendiente"}
                colorClassName={f.estado === "real" ? "text-chart-1" : "text-muted-foreground"}
                last={i === FUENTES_DE_DATOS.length - 1}
              />
            ))}
          </div>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <ModuleHeader eyebrow="IA y predicción" title="Resumen del modelo" />
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-chart-1" />
            <p className="text-sm text-muted-foreground">
              Delegación con mayor demanda proyectada:{" "}
              <span className="font-semibold text-foreground">{delegacionTop.nombre}</span>{" "}
              ({Math.round(delegacionTop.ocupacion * 100)}% de ocupación).
            </p>
          </div>
          <Link
            href="/modulos/prediccion_asignacion"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver Predicción y Asignación <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>

      <section className="space-y-2 rounded-lg border bg-card p-5">
        <ModuleHeader eyebrow="Reportes" title="Reporteador" action={<ReportExporter rows={reportRows} />} />
        <p className="text-sm text-muted-foreground">
          Exporta los KPIs de este Tablero a CSV. Los valores son de ejemplo, no datos
          operativos reales del ICVNL.
        </p>
      </section>
    </div>
  );
}
