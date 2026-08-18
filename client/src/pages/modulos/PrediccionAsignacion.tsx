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
import { EmptyState } from "@/components/dashboard";
import { TrendingUp, DoorOpen } from "lucide-react";
import PreviewPrediccion from "./PrediccionDemanda";
import PreviewAsignador from "./AsignadorVentanillas";

export default function PreviewPrediccionAsignacion() {
  const { data: accessibleModules } = trpc.auth.getAccessibleModules.useQuery();
  const modules = accessibleModules ?? [];
  const puedePrediccion = modules.includes("prediccion_demanda");
  const puedeAsignador = modules.includes("asignador_ventanillas");

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
