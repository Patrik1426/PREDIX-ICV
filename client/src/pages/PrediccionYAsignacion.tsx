// ============================================================
// PrediccionYAsignacion — página real de primer nivel para el módulo
// Predicción y Asignación. Mismo tratamiento que AsistenteVirtual.tsx y
// CitasYOperacion.tsx: sale del shell genérico de ModuloDetalle.tsx (sin
// "Módulo NN" ni stepper) — pero, igual que Citas y Operación, SIGUE siendo
// demo: no hay backend real de predicción/asignación todavía (Workstream A
// del roadmap, bloqueado sin acceso a Oracle/VPN del ICVNL). El badge
// "Datos de ejemplo" se queda.
// ============================================================

import { Redirect } from "wouter";
import { ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { hasGroupAccess } from "@/lib/moduleGroups";
import { MODULE_DESCRIPTIONS } from "@/lib/moduleLabels";
import { MODULE_DESARROLLO } from "@/components/demo/ModuloDesarrollo";
import { DatoEjemplo } from "@/components/demo/DemoVisuals";
import PreviewPrediccionAsignacion from "@/pages/modulos/PrediccionAsignacion";

export default function PrediccionYAsignacion() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();

  if (!isLoading && !hasGroupAccess("prediccion_asignacion", accessibleModules)) return <Redirect to="/" />;

  return (
    <div className="container py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predicción y Asignación</h1>
          <p className="mt-1 text-muted-foreground">{MODULE_DESCRIPTIONS.prediccion_asignacion}</p>
        </div>
        <DatoEjemplo />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <PreviewPrediccionAsignacion />
      </div>

      <details className="group rounded-xl border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-semibold">
          Cómo funcionará
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t px-6 py-6">{MODULE_DESARROLLO.prediccion_asignacion}</div>
      </details>
    </div>
  );
}
