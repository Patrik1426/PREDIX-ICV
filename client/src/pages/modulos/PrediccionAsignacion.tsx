// ============================================================
// PrediccionAsignacion — fusiona Predicción de Demanda + Asignador de
// Ventanillas en una sola vista con tabs. El RBAC real sigue siendo
// granular (prediccion_demanda / asignador_ventanillas por separado, ver
// server/_core/infra/permissions.ts) — este componente solo decide qué tab
// mostrar según lo que el rol puede ver. Corre sobre @/lib/demoData a
// través de las páginas que envuelve, nunca datos reales del ICVNL.
// ============================================================

import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, SkeletonKpi } from "@/components/dashboard";
import { TrendingUp, DoorOpen } from "lucide-react";
import PreviewPrediccion from "./PrediccionDemanda";
import PreviewAsignador from "./AsignadorVentanillas";
import { MODULE_GROUPS } from "@/lib/moduleGroups";

const [SLUG_PREDICCION, SLUG_ASIGNADOR] = MODULE_GROUPS.prediccion_asignacion;

export default function PreviewPrediccionAsignacion() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();
  const modules = accessibleModules ?? [];
  const puedePrediccion = modules.includes(SLUG_PREDICCION);
  const puedeAsignador = modules.includes(SLUG_ASIGNADOR);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SkeletonKpi />
        <SkeletonKpi />
      </div>
    );
  }

  if (!puedePrediccion && !puedeAsignador) {
    return <EmptyState text="Tu rol no tiene permiso para ver Predicción ni Asignación." />;
  }
  if (puedePrediccion && !puedeAsignador) return <PreviewPrediccion />;
  if (puedeAsignador && !puedePrediccion) return <PreviewAsignador />;

  return (
    <Tabs defaultValue="prediccion" className="w-full">
      <TabsList>
        <TabsTrigger value="prediccion">
          <TrendingUp className="mr-1.5 h-3.5 w-3.5" /> Predicción
        </TabsTrigger>
        <TabsTrigger value="asignacion">
          <DoorOpen className="mr-1.5 h-3.5 w-3.5" /> Asignación
        </TabsTrigger>
      </TabsList>
      <TabsContent value="prediccion">
        <PreviewPrediccion />
      </TabsContent>
      <TabsContent value="asignacion">
        <PreviewAsignador />
      </TabsContent>
    </Tabs>
  );
}
