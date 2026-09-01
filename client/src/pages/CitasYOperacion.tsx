// ============================================================
// CitasYOperacion — reemplazo total con el diseño de predix-icvnl
// (Operations.tsx), recoloreado a tokens ICVNL. El guard de RBAC a nivel
// de página se conserva — ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// El gating granular por sección (citas/monitor) que existía antes de
// este port se pierde, como el resto de la interactividad — trabajo de
// reintegración futuro.
//
// 2026-08-31: refactor dirigido (modo Refactor de predix-section-review) —
// dividido en client/src/components/predix/operacion/ (un archivo por
// sección visual, mismo patrón que predix/tablero/* y predix/politica/*).
// ============================================================

import { Redirect } from "wouter";
import { trpc } from "@/lib/trpc";
import { hasGroupAccess } from "@/lib/moduleGroups";
import { DemoNotice } from "@/components/predix/DemoNotice";
import { PageHeader } from "@/components/predix/PageHeader";
import { Badge } from "@/components/ui/badge";
import { operationsData } from "@/lib/predixDemoData";
import { Activity } from "lucide-react";
import { ExperienciaUsuario } from "@/components/predix/operacion/ExperienciaUsuario";
import { EstadoDelegaciones } from "@/components/predix/operacion/EstadoDelegaciones";
import { MatrizDemanda } from "@/components/predix/operacion/MatrizDemanda";
import { AccionSugerida } from "@/components/predix/operacion/AccionSugerida";
import { Incidencias } from "@/components/predix/operacion/Incidencias";

export default function CitasYOperacion() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();

  if (!isLoading && !hasGroupAccess("citas_operacion", accessibleModules)) return <Redirect to="/" />;

  const data = operationsData;
  // Derivado de delegationStatus en vez de un array separado hardcodeado —
  // ambos ya debían coincidir 1:1 (mismas 4 delegaciones), esto lo garantiza.
  const locations = data.delegationStatus.map((d) => d.name);

  return (
    <div className="container py-10">
      <PageHeader
        eyebrow="Operación institucional"
        title="Visibilidad para intervenir en el momento correcto"
        description="Monitoreo demostrativo de capacidad, demanda, experiencia usuaria e incidencias por delegación para coordinar acciones de corto plazo."
        action={<Badge className="rounded-full bg-success/10 px-3.5 py-1.5 text-xs font-bold text-success hover:bg-success/10"><Activity className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />Actualización operativa simulada</Badge>}
      />
      <DemoNotice text={data.notice} />

      <ExperienciaUsuario experience={data.userExperience} />

      <EstadoDelegaciones delegations={data.delegationStatus} />

      <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.25fr_.75fr]">
        <MatrizDemanda hourlyHeat={data.hourlyHeat} locations={locations} />
        <AccionSugerida delegationStatus={data.delegationStatus} drivers={data.userExperience.drivers} hourlyHeat={data.hourlyHeat} />
      </div>

      <Incidencias incidents={data.incidents} />
    </div>
  );
}
