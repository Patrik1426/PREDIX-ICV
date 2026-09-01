// ============================================================
// PolicyStudio — página nueva, portada de predix-icvnl (PolicyStudio.tsx),
// recoloreada a tokens ICVNL. Sin RBAC slug propio — visible a cualquier
// usuario autenticado (ver AppShell.tsx). 100% dato de ejemplo sin ancla
// real en el ICVNL — DemoNotice es la etiqueta honesta, mismo criterio
// que las otras páginas de este port. Ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
//
// 2026-08-27: dividido en subcomponentes por sección (client/src/components/
// predix/politica/) — mismo patrón de descomposición ya aplicado a Tablero.
// ============================================================

import { DemoNotice } from "@/components/predix/DemoNotice";
import { PageHeader } from "@/components/predix/PageHeader";
import { CrucesEvidencia } from "@/components/predix/politica/CrucesEvidencia";
import { LenteFiltro } from "@/components/predix/politica/LenteFiltro";
import { MallaEvidencia } from "@/components/predix/politica/MallaEvidencia";
import { PortafolioIntervenciones } from "@/components/predix/politica/PortafolioIntervenciones";
import { SegmentosPriorizables } from "@/components/predix/politica/SegmentosPriorizables";
import { SimuladorPolitica } from "@/components/predix/politica/SimuladorPolitica";
import type { SegmentFilter } from "@/components/predix/politica/types";
import { Button } from "@/components/ui/button";
import { policyData } from "@/lib/predixDemoData";
import { buildPolicyEvidence, simulateDiscountPolicy } from "@/lib/policySimulacion";
import { DatabaseZap } from "lucide-react";
import { useState } from "react";

export default function PolicyStudio() {
  const [discount, setDiscount] = useState(6);
  const [segment, setSegment] = useState<SegmentFilter>("todos");
  const data = policyData;
  const simulation = simulateDiscountPolicy(discount);
  const evidence = buildPolicyEvidence(segment, data.sources);

  return (
    <div className="container py-10">
      <PageHeader
        eyebrow="Diseño de política pública"
        title="De la señal de datos a la intervención pública"
        description="Cruce de fuentes institucionales, segmentación poblacional y simulación de acciones para mejorar recaudo, acceso y eficiencia de atención."
        action={
          <Button data-testid="politica-nueva-hipotesis" className="rounded-xl bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90">
            <DatabaseZap className="mr-2 h-4 w-4" aria-hidden="true" />Nueva hipótesis
          </Button>
        }
      />
      <DemoNotice text={data.notice} />

      <LenteFiltro segment={segment} onSegmentChange={setSegment} />
      <MallaEvidencia sources={data.sources} />
      <CrucesEvidencia evidence={evidence} />

      <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-[.88fr_1.12fr]">
        <SimuladorPolitica discount={discount} onDiscountChange={setDiscount} simulation={simulation} />
        <SegmentosPriorizables segments={data.segments} />
      </div>

      <PortafolioIntervenciones opportunities={data.opportunities} />
    </div>
  );
}
