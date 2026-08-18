// ============================================================
// CitasOperacion — fusiona Sistema de Citas + Monitor de Operaciones en
// una sola vista con tabs. El RBAC real sigue siendo granular (citas /
// monitor por separado). Corre sobre @/lib/demoData a través de las
// páginas que envuelve, nunca datos reales del ICVNL.
// ============================================================

import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/dashboard";
import { CalendarClock, Activity } from "lucide-react";
import PreviewCitas from "./Citas";
import PreviewMonitor from "./Monitor";

export default function PreviewCitasOperacion() {
  const { data: accessibleModules } = trpc.auth.getAccessibleModules.useQuery();
  const modules = accessibleModules ?? [];
  const puedeCitas = modules.includes("citas");
  const puedeMonitor = modules.includes("monitor");

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
