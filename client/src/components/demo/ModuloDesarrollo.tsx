// ============================================================
// ModuloDesarrollo — el "qué incluirá este módulo" de cada uno de los 5,
// cada uno con la estructura que le corresponde a su propio contenido real
// (horizonte de modelos, ciclo de vida, función objetivo, KPIs, capacidades)
// en vez de una lista de checkmarks genérica. Todo sale de proposalData.ts
// (texto real de la propuesta) y demoData.ts (ejemplos ilustrativos).
// ============================================================

import { Fragment, type ReactNode } from "react";
import {
  PREDICCION_MODELOS,
  PREDICCION_ESCALA_DIAS,
  PREDICCION_SALIDAS,
  ASIGNADOR_OBJETIVO,
  ASIGNADOR_RESTRICCIONES,
  CITAS_CICLO,
  CITAS_CANALES,
  MONITOR_KPIS,
  MONITOR_ALERTAS,
  CHATBOT_CAPACIDADES,
  CHATBOT_IMPACTO,
  ADMIN_CAPACIDADES,
} from "@/lib/proposalData";
import { DEMO_TRAMITES, DEMO_MATRIZ_COMPETENCIAS } from "@/lib/demoData";
import { DatoEjemplo } from "@/components/demo/DemoVisuals";
import { cn } from "@/lib/utils";
import {
  Waypoints,
  ShieldAlert,
  DoorOpen,
  Globe,
  Smartphone,
  MessageSquare,
  Check,
  Wrench,
  Zap,
  CalendarRange,
  TrendingUp,
  Search,
  Sparkles,
  CheckCircle2,
  BellRing,
  RotateCcw,
  Clock,
  UserX,
  Smile,
  FileQuestion,
  CalendarPlus,
  Users,
  ScrollText,
} from "lucide-react";

// ---- 01 · Predicción — tres modelos sobre una misma regla temporal, porque
// el horizonte (no el orden) es el dato real que los distingue. Un ícono
// distinto por modelo ayuda a escanear la fila sin leer la etiqueta completa. ----
const HORIZONTE_TICKS = [
  { dias: 1, etiqueta: "1 día" },
  { dias: 7, etiqueta: "1 semana" },
  { dias: 30, etiqueta: "1 mes" },
  { dias: 90, etiqueta: "3 meses" },
  { dias: 180, etiqueta: "6 meses" },
];

const MODELO_ICONS = [Zap, CalendarRange, TrendingUp];

function posPct(dias: number) {
  const { min, max } = PREDICCION_ESCALA_DIAS;
  return ((Math.log10(dias) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))) * 100;
}

function DesarrolloPrediccion() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold">Tres modelos, tres horizontes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          El motor no usa un solo algoritmo: combina modelos afinados para distintas ventanas de tiempo, del día
          siguiente a medio año adelante.
        </p>
      </div>

      <div className="space-y-4">
        {PREDICCION_MODELOS.map((m, i) => {
          const Icon = MODELO_ICONS[i];
          return (
            <div key={m.modelo} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chart-1/10 text-chart-1">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="font-medium">{m.modelo}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{m.horizonteLabel}</span>
                </div>
                <div className="relative h-2 rounded-full bg-muted">
                  <div
                    className="absolute h-full rounded-full bg-chart-1"
                    style={{ left: `${posPct(m.diasMin)}%`, width: `${posPct(m.diasMax) - posPct(m.diasMin)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.aplicacion}</p>
              </div>
            </div>
          );
        })}

        <div className="relative ml-11 h-4 border-t text-[10px] text-muted-foreground">
          {HORIZONTE_TICKS.map((t) => (
            <span key={t.dias} className="absolute top-1.5 -translate-x-1/2 whitespace-nowrap" style={{ left: `${posPct(t.dias)}%` }}>
              {t.etiqueta}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Lo que entrega, por delegación/trámite/hora
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PREDICCION_SALIDAS.map((s, i) => {
            const Icon = [Waypoints, ShieldAlert, DoorOpen][i];
            return (
              <div key={s.titulo} className="rounded-xl border bg-muted/30 p-3">
                <Icon className="mb-2 h-4 w-4 text-chart-1" />
                <div className="text-sm font-medium leading-tight">{s.titulo}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.detalle}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- 02 · Asignador — función objetivo + restricciones + matriz de
// competencias como mapa de calor: el color agrupa de un vistazo quién
// cubre más trámites, y el ícono evita depender solo del color. ----
function DesarrolloAsignador() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold">Cómo decide</h2>
        <div className="mt-2 rounded-xl border bg-chart-2/10 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-chart-2">Minimizar</div>
          <p className="mt-0.5 font-medium">{ASIGNADOR_OBJETIVO}</p>
        </div>
        <p className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sujeto a</p>
        <div className="flex flex-wrap gap-2">
          {ASIGNADOR_RESTRICCIONES.map((r) => (
            <span key={r} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
              {r}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Matriz de competencias — quién atiende qué
          </h3>
          <DatoEjemplo />
        </div>
        <div className="overflow-x-auto rounded-xl border p-3">
          <div
            className="grid w-max items-center gap-1.5"
            style={{ gridTemplateColumns: `7rem repeat(${DEMO_TRAMITES.length}, 2.75rem)` }}
          >
            <span />
            {DEMO_TRAMITES.map((t) => (
              <span key={t} className="px-0.5 text-center text-[10px] font-medium leading-tight text-muted-foreground">
                {t}
              </span>
            ))}
            {DEMO_MATRIZ_COMPETENCIAS.map((row) => (
              <Fragment key={row.empleado}>
                <span className="truncate text-xs font-medium">{row.empleado}</span>
                {DEMO_TRAMITES.map((t) => {
                  const puede = (row.tramites as readonly string[]).includes(t);
                  return (
                    <div
                      key={t}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md",
                        puede ? "bg-chart-2 text-white" : "bg-muted"
                      )}
                      title={`${row.empleado} · ${t}${puede ? "" : " (no capacitado)"}`}
                    >
                      {puede && <Check className="h-4 w-4" />}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- 03 · Citas — ciclo de vida real de una cita, como flujo horizontal
// con conectores: esto sí es una secuencia genuina, por eso lleva orden. ----
const CANAL_ICONS: Record<string, ReactNode> = {
  "Portal web": <Globe className="h-4 w-4" />,
  "App móvil": <Smartphone className="h-4 w-4" />,
  WhatsApp: <MessageSquare className="h-4 w-4" />,
};

const CICLO_ICONS = [Search, Sparkles, CheckCircle2, BellRing, RotateCcw];

function DesarrolloCitas() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-sm font-semibold">Ciclo de vida de una cita</h2>
        <div className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-2">
          {CITAS_CICLO.map((c, i) => {
            const Icon = CICLO_ICONS[i];
            return (
              <div key={c.paso} className="flex flex-1 sm:flex-col">
                <div className="flex flex-col items-center sm:w-full">
                  <div className="flex items-center sm:w-full">
                    <div
                      className={cn(
                        "hidden h-px flex-1 bg-border sm:block",
                        i === 0 && "sm:invisible"
                      )}
                    />
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chart-5/15 text-chart-5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div
                      className={cn(
                        "hidden h-px flex-1 bg-border sm:block",
                        i === CITAS_CICLO.length - 1 && "sm:invisible"
                      )}
                    />
                  </div>
                </div>
                <div className="ml-3 mt-0 flex-1 pb-4 sm:ml-0 sm:mt-2 sm:pb-0 sm:text-center">
                  <div className="text-sm font-medium leading-tight">{c.paso}</div>
                  <div className="text-xs text-muted-foreground sm:px-1">{c.detalle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disponible en</h3>
        <div className="flex flex-wrap gap-2">
          {CITAS_CANALES.map((canal) => (
            <span key={canal} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs">
              <span className="text-chart-5">{CANAL_ICONS[canal]}</span>
              {canal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- 04 · Monitor — panel de metas (siempre visibles, no solo al pasar el
// mouse), con un ícono temático por indicador para escanear más rápido. ----
const MONITOR_ICONS = [Clock, DoorOpen, UserX, Smile];

function DesarrolloMonitor() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-3 text-sm font-semibold">Metas del panel</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MONITOR_KPIS.map((k, i) => {
            const Icon = MONITOR_ICONS[i];
            return (
              <div key={k.indicador} className="rounded-xl border bg-chart-4/5 p-3">
                <Icon className="mb-2 h-4 w-4 text-chart-4" />
                <div className="text-sm font-bold tabular-nums text-chart-4">{k.meta}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{k.indicador}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Alertas proactivas</h3>
        <div className="space-y-2">
          {MONITOR_ALERTAS.map((a) => (
            <div key={a.titulo} className="flex items-start gap-2 rounded-lg border-l-2 border-chart-4 bg-muted/30 px-3 py-2">
              <div>
                <div className="text-sm font-medium leading-tight">{a.titulo}</div>
                <div className="text-xs text-muted-foreground">{a.detalle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- 05 · Asistente — capacidades con ícono + el impacto estimado como
// cifra destacada (es el dato más persuasivo de esta sección). ----
const CHATBOT_ICONS = [FileQuestion, Clock, CalendarPlus];

function DesarrolloChatbot() {
  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold">Qué incluirá este módulo</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CHATBOT_CAPACIDADES.map((c, i) => {
          const Icon = CHATBOT_ICONS[i];
          return (
            <div key={c.titulo} className="rounded-xl border bg-chart-3/10 p-3">
              <Icon className="mb-2 h-4 w-4 text-chart-3" />
              <div className="text-sm font-medium leading-tight">{c.titulo}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{c.detalle}</div>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="text-3xl font-bold tabular-nums text-chart-3">{CHATBOT_IMPACTO.pct}</div>
        <p className="mt-1 text-sm text-muted-foreground">{CHATBOT_IMPACTO.detalle}</p>
      </div>
    </div>
  );
}

// ---- admin · No es parte del pipeline — su backend ya existe, así que la
// nota de estado importa más que la lista de capacidades. ----
const ADMIN_ICONS = [Users, ScrollText];

function DesarrolloAdmin() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Qué incluirá esta pantalla</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ADMIN_CAPACIDADES.map((c, i) => {
          const Icon = ADMIN_ICONS[i];
          return (
            <div key={c.titulo} className="rounded-xl border bg-muted/30 p-3">
              <Icon className="mb-2 h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium leading-tight">{c.titulo}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{c.detalle}</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-sm">
        <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-muted-foreground">
          Backend construido y probado (<code className="text-foreground">server/routers/usuarios.ts</code>,{" "}
          <code className="text-foreground">admin.ts</code>) — falta solo la pantalla.
        </span>
      </div>
    </div>
  );
}

export const MODULE_DESARROLLO: Record<string, ReactNode> = {
  prediccion_asignacion: (
    <div className="space-y-8">
      <DesarrolloPrediccion />
      <div className="border-t pt-8">
        <DesarrolloAsignador />
      </div>
    </div>
  ),
  citas_operacion: (
    <div className="space-y-8">
      <DesarrolloCitas />
      <div className="border-t pt-8">
        <DesarrolloMonitor />
      </div>
    </div>
  ),
  chatbot: <DesarrolloChatbot />,
  admin: <DesarrolloAdmin />,
};
