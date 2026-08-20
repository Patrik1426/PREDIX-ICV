// ============================================================
// ModuloDetalle — vista previa interactiva de un módulo aún no construido.
// Cada Preview deja tocar/hacer clic algo para sentir cómo se comportaría
// el módulo real — pero todo corre sobre @/lib/demoData, nunca datos del
// ICVNL ni el LLM real.
// ============================================================

import type { ComponentType } from "react";
import { useParams, Redirect, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { MODULE_LABELS, MODULE_DESCRIPTIONS } from "@/lib/moduleLabels";
import { MODULE_ICONS, MODULE_ORDER, MODULE_ACCENT } from "@/lib/moduleIcons";
import { DatoEjemplo, LlmReal } from "@/components/demo/DemoVisuals";
import { MODULE_DESARROLLO } from "@/components/demo/ModuloDesarrollo";
import { ChevronLeft, ChevronRight, ArrowLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import PreviewPrediccionAsignacion from "@/pages/modulos/PrediccionAsignacion";
import PreviewCitasOperacion from "@/pages/modulos/CitasOperacion";
import PreviewChatbot from "@/pages/modulos/Chatbot";
import { hasGroupAccess } from "@/lib/moduleGroups";

export const MODULE_PREVIEWS: Record<string, ComponentType> = {
  prediccion_asignacion: PreviewPrediccionAsignacion,
  citas_operacion: PreviewCitasOperacion,
  chatbot: PreviewChatbot,
};

function Preview({ slug }: { slug: string }) {
  const Component = MODULE_PREVIEWS[slug];
  if (!Component) return <p className="text-sm text-muted-foreground">Sin vista previa disponible todavía.</p>;
  return <Component />;
}

export default function ModuloDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();

  if (!slug || !MODULE_LABELS[slug]) return <Redirect to="/" />;
  if (!isLoading && !hasGroupAccess(slug, accessibleModules)) return <Redirect to="/" />;

  const accent = MODULE_ACCENT[slug];
  const pipelineIndex = MODULE_ORDER.indexOf(slug as (typeof MODULE_ORDER)[number]);
  const anterior = pipelineIndex > 0 ? MODULE_ORDER[pipelineIndex - 1] : null;
  const siguiente = pipelineIndex >= 0 && pipelineIndex < MODULE_ORDER.length - 1 ? MODULE_ORDER[pipelineIndex + 1] : null;

  return (
    <div className="container max-w-3xl py-10 space-y-6">
      <Link href="/" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Tablero
      </Link>

      {pipelineIndex >= 0 && (
        <div className="flex items-center gap-1.5">
          {MODULE_ORDER.map((s, i) => (
            <Link
              key={s}
              href={`/modulos/${s}`}
              title={MODULE_LABELS[s]}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i === pipelineIndex ? MODULE_ACCENT[s].solid : i < pipelineIndex ? "bg-border" : "bg-muted"
              )}
            />
          ))}
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", accent.soft, accent.text)}>
          {MODULE_ICONS[slug]}
        </div>
        <div>
          {pipelineIndex >= 0 && (
            <div className={cn("mb-1 text-[11px] font-semibold uppercase tracking-widest", accent.text)}>
              Módulo {String(pipelineIndex + 1).padStart(2, "0")}
            </div>
          )}
          <h1 className="text-2xl font-bold leading-tight">{MODULE_LABELS[slug]}</h1>
          <p className="mt-1 text-muted-foreground">{MODULE_DESCRIPTIONS[slug]}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Vista previa interactiva</h2>
          {slug === "chatbot" ? <LlmReal /> : <DatoEjemplo />}
        </div>
        <Preview slug={slug} />
      </div>

      <details className="group rounded-xl border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-semibold">
          Detalle técnico
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t px-6 py-6">
          {MODULE_DESARROLLO[slug]}
        </div>
      </details>

      {(anterior || siguiente) && (
        <div className="flex items-center justify-between gap-4 border-t pt-6">
          {anterior ? (
            <Link href={`/modulos/${anterior}`} className="group flex min-w-0 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
              <span className="truncate">{MODULE_LABELS[anterior]}</span>
            </Link>
          ) : (
            <span />
          )}
          {siguiente ? (
            <Link href={`/modulos/${siguiente}`} className="group flex min-w-0 items-center gap-2 text-right text-sm text-muted-foreground hover:text-foreground">
              <span className="truncate">{MODULE_LABELS[siguiente]}</span>
              <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
