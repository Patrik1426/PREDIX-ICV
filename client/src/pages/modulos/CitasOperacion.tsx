// ============================================================
// CitasOperacion — fusiona Sistema de Citas + Monitor de Operaciones en
// una sola vista con tabs. El RBAC real sigue siendo granular (citas /
// monitor por separado). Corre sobre @/lib/demoData a través de las
// páginas que envuelve, nunca datos reales del ICVNL.
// ============================================================

import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, SkeletonKpi } from "@/components/dashboard";
import { CalendarClock, Activity } from "lucide-react";
import PreviewCitas from "./Citas";
import PreviewMonitor from "./Monitor";
import { MODULE_GROUPS } from "@/lib/moduleGroups";

const [SLUG_CITAS, SLUG_MONITOR] = MODULE_GROUPS.citas_operacion;

export default function PreviewCitasOperacion() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();
  const modules = accessibleModules ?? [];
  const puedeCitas = modules.includes(SLUG_CITAS);
  const puedeMonitor = modules.includes(SLUG_MONITOR);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SkeletonKpi />
        <SkeletonKpi />
      </div>
    );
  }

  if (!puedeCitas && !puedeMonitor) {
    return <EmptyState text="Tu rol no tiene permiso para ver Citas ni Operación." />;
  }
  if (puedeCitas && !puedeMonitor) return <PreviewCitas />;
  if (puedeMonitor && !puedeCitas) return <PreviewMonitor />;

  return (
    <Tabs defaultValue="citas" className="w-full">
      <TabsList>
        <TabsTrigger value="citas">
          <CalendarClock className="mr-1.5 h-3.5 w-3.5" /> Citas
        </TabsTrigger>
        <TabsTrigger value="operacion">
          <Activity className="mr-1.5 h-3.5 w-3.5" /> Operación
        </TabsTrigger>
      </TabsList>
      <TabsContent value="citas">
        <PreviewCitas />
      </TabsContent>
      <TabsContent value="operacion">
        <PreviewMonitor />
      </TabsContent>
    </Tabs>
  );
}
