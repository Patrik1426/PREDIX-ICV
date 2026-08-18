// ============================================================
// RESUMEN — página de inicio post-login de PREDIX-ICV.
// Resume la propuesta: diagnóstico, los 5 módulos (enlazan a su vista
// previa en /modulos/:slug), arquitectura, resultados esperados y fases.
// Cifras de "resultados esperados", "metas" y "fases" vienen literalmente
// de docs/Propuesta PREDIX ICVNL Paco.docx — no son mediciones del ICVNL.
// ============================================================

import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { INSTITUTIONAL_ROLE_LABELS } from "@/lib/institutionalRoles";
import { DEMO_DELEGACIONES, DEMO_DEMANDA_HORARIA, DEMO_KPIS } from "@/lib/demoData";
import { DIAGNOSTICO, RESULTADOS_ESPERADOS, FASES, ARQUITECTURA_CAPAS, METAS_12_MESES } from "@/lib/proposalData";
import { CarrilFlujo, DatoEjemplo, MetaDelProyecto, ForecastChart, BulletKpi } from "@/components/demo/DemoVisuals";
import { Reveal } from "@/components/layout/Reveal";
import { LineaCarril } from "@/components/layout/LineaCarril";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AlertTriangle, ChevronRight, ChevronDown, TrendingUp, DoorOpen, CalendarClock, Activity, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PROPUESTA_MODULOS = [
  {
    nombre: "Motor de Predicción de Demanda",
    descripcion: "Anticipa volumen y tipo de trámites por delegación, día y hora.",
    ruta: "/modulos/prediccion_asignacion",
    icon: <TrendingUp className="h-5 w-5" />,
    accent: "text-chart-1",
  },
  {
    nombre: "Asignador Dinámico de Ventanillas",
    descripcion: "Redistribuye ventanillas en tiempo real según la demanda.",
    ruta: "/modulos/prediccion_asignacion",
    icon: <DoorOpen className="h-5 w-5" />,
    accent: "text-chart-1",
  },
  {
    nombre: "Sistema de Citas Inteligente",
    descripcion: "Agenda con optimización automática de carga por delegación.",
    ruta: "/modulos/citas_operacion",
    icon: <CalendarClock className="h-5 w-5" />,
    accent: "text-chart-5",
  },
  {
    nombre: "Monitor de Operaciones en Tiempo Real",
    descripcion: "KPIs operativos y alertas de saturación en tiempo real.",
    ruta: "/modulos/citas_operacion",
    icon: <Activity className="h-5 w-5" />,
    accent: "text-chart-5",
  },
  {
    nombre: "Asistente Virtual",
    descripcion: "Asistente conversacional para consultas ciudadanas.",
    ruta: "/modulos/chatbot",
    icon: <MessageCircle className="h-5 w-5" />,
    accent: "text-chart-3",
  },
] as const;

export default function Propuesta() {
  const [delegacionAbierta, setDelegacionAbierta] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: profile } = trpc.auth.getUserProfile.useQuery();

  const roleLabel = profile?.institutionalRole
    ? INSTITUTIONAL_ROLE_LABELS[profile.institutionalRole] ?? profile.institutionalRole
    : "";

  return (
    <div className="container py-10 space-y-14">
      {/* HERO — tesis del producto */}
      <section className="space-y-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-sm font-medium text-primary">
              Hola, {(user?.name ?? profile?.name ?? "").split(" ")[0] || "de nuevo"}
              {roleLabel ? ` · ${roleLabel}` : ""}
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Anticipar la fila,{" "}
              <span className="text-primary">antes de que se forme.</span>
            </h1>
            <p className="max-w-md text-muted-foreground">
              PREDIX-ICV combina predicción de demanda y asignación dinámica de
              ventanillas para que cada delegación del ICVNL opere con la carga
              justa, todos los días del año.
            </p>

            <div className="pt-1">
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Real (demo) vs. meta del proyecto
                </h2>
                <DatoEjemplo />
                <MetaDelProyecto />
              </div>
              <div className="space-y-4">
                <BulletKpi label="Tiempo de espera" actual={DEMO_KPIS.tiempoEsperaPromedioMin} meta={METAS_12_MESES.tiempoEsperaMin} max={40} unidad=" min" />
                <BulletKpi
                  label="Trámites con cita previa"
                  actual={DEMO_KPIS.tramitesConCitaPct}
                  meta={METAS_12_MESES.tramitesConCitaPct}
                  max={60}
                  unidad="%"
                  menorEsMejor={false}
                />
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-semibold tabular-nums">{DEMO_KPIS.delegacionesEnAlerta}</span>
                <span className="text-muted-foreground">delegación en alerta ahora mismo</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Ocupación por delegación</h2>
              <DatoEjemplo />
            </div>
            <p className="mb-3 text-xs text-muted-foreground">Toca una delegación para ver su curva de demanda.</p>
            <div className="space-y-1">
              {DEMO_DELEGACIONES.map((d) => {
                const abierta = delegacionAbierta === d.nombre;
                const factor = 0.5 + d.ocupacion;
                const curva = DEMO_DEMANDA_HORARIA.map((v) => Math.round(v * factor));
                return (
                  <div key={d.nombre} className="rounded-md -mx-2 px-2 py-1.5 hover:bg-muted/50">
                    <button
                      className="flex w-full items-center gap-2 text-left"
                      onClick={() => setDelegacionAbierta(abierta ? null : d.nombre)}
                      aria-expanded={abierta}
                    >
                      <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", abierta && "rotate-180")} />
                      <CarrilFlujo {...d} />
                    </button>
                    {abierta && (
                      <div className="mt-2 pl-6">
                        <p className="mb-1 text-[11px] text-muted-foreground">Demanda proyectada, {d.nombre}</p>
                        <ForecastChart values={curva} nowIndex={9} className="h-14" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <LineaCarril />

      {/* DIAGNÓSTICO — ledger numerado, en el orden real del documento */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeading eyebrow="Diagnóstico" title="Por qué el ICVNL necesita esto">
            Cinco problemas estructurales identificados en el diagnóstico de campo.
          </SectionHeading>
          <div>
            {DIAGNOSTICO.map((item, i) => (
              <div key={item.titulo} className={cn("flex gap-4 py-4", i !== 0 && "border-t")}>
                <span className="w-7 shrink-0 text-2xl font-bold text-muted-foreground/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold leading-tight">{item.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* MÓDULOS — los 5 tal como los describe la propuesta original. El
          producto construido los consolidó en 3 (ver el Tablero). */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeading eyebrow="Solución" title="5 módulos de la propuesta original">
            Como se describieron en la propuesta técnica. Toca uno para ver su vista previa
            en el producto ya consolidado.
          </SectionHeading>

          <div className="rounded-lg border">
            {PROPUESTA_MODULOS.map((m, i) => (
              <Link
                key={m.nombre}
                href={m.ruta}
                className={cn(
                  "group relative flex items-center gap-4 py-3.5 pl-4 pr-3 transition-colors hover:bg-muted/50",
                  i !== 0 && "border-t"
                )}
              >
                <span className={cn("w-6 shrink-0 text-sm font-bold tabular-nums", m.accent)}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("shrink-0", m.accent)}>{m.icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold leading-tight">{m.nombre}</h3>
                  <p className="truncate text-xs text-muted-foreground">{m.descripcion}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ARQUITECTURA */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeading eyebrow="Arquitectura" title="Cuatro capas de la plataforma">
            De la interacción ciudadana al dato crudo.
          </SectionHeading>
          <div className="rounded-lg border">
            {ARQUITECTURA_CAPAS.map((capa, i) => (
              <div key={capa.nombre} className={cn("flex items-center gap-4 px-5 py-3.5", i !== 0 && "border-t")}>
                <span className="w-4 shrink-0 text-center text-xs tabular-nums text-muted-foreground/50">{i + 1}</span>
                <span className="w-32 shrink-0 text-sm font-semibold">{capa.nombre}</span>
                <span className="text-sm text-muted-foreground">{capa.detalle}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* RESULTADOS ESPERADOS — ledger, no tarjetas repetidas */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeading eyebrow="Impacto" title="Resultados esperados" action={<MetaDelProyecto />}>
            Metas de la propuesta a 12 meses de operación — no son mediciones en vivo.
          </SectionHeading>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b bg-muted/40">
                  {RESULTADOS_ESPERADOS.map((r) => (
                    <th key={r.metrica} className="whitespace-nowrap px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      {r.metrica}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  {RESULTADOS_ESPERADOS.map((r) => (
                    <td key={r.metrica} className="px-4 py-2 text-2xl font-bold tabular-nums text-primary">
                      {r.cambio}
                    </td>
                  ))}
                </tr>
                <tr>
                  {RESULTADOS_ESPERADOS.map((r) => (
                    <td key={r.metrica} className="px-4 py-2.5 text-xs text-muted-foreground">
                      {r.detalle}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>

      {/* FASES — carril con la línea de la marca, sí es una secuencia real */}
      <Reveal>
        <section className="space-y-4">
          <SectionHeading eyebrow="Hoja de ruta" title="Fases de implementación">
            Piloto → expansión → consolidación, con validación antes de escalar.
          </SectionHeading>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {FASES.map((fase, i) => (
              <div key={fase.nombre}>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{i + 1}</span>
                  <LineaCarril className="flex-1" />
                </div>
                <h3 className="mt-2 font-semibold leading-tight">{fase.nombre}</h3>
                <div className="text-xs text-muted-foreground">{fase.duracion}</div>
                <p className="mt-2 text-sm">{fase.alcance}</p>
                <p className="mt-1 text-xs text-muted-foreground">{fase.entregable}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
