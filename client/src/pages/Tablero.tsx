// ============================================================
// Tablero — reemplazo total con el diseño de predix-icvnl (Home.tsx),
// recoloreado a los tokens ICVNL. Ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// Los filtros de periodo/delegación son exactamente tan funcionales como
// en predix-icvnl: el de delegación acota la tabla de desempeño de verdad
// (client-side); el de periodo solo cambia la etiqueta mostrada, igual
// que en la fuente (su propio backend tampoco filtraba por periodo).
//
// 2026-08-26: dividido en subcomponentes por sección (client/src/components/
// predix/tablero/) — antes era un solo archivo de ~200 líneas con 6 widgets
// inline. Cada sección es ahora su propia unidad con props explícitas.
// ============================================================

import { PageHeader } from "@/components/predix/PageHeader";
import { MetricCard } from "@/components/predix/MetricCard";
import { DemoNotice } from "@/components/predix/DemoNotice";
import { AlertasPanel } from "@/components/predix/tablero/AlertasPanel";
import { DemandaChart } from "@/components/predix/tablero/DemandaChart";
import { DesempenoDelegacion } from "@/components/predix/tablero/DesempenoDelegacion";
import { FiltrosAnalisis } from "@/components/predix/tablero/FiltrosAnalisis";
import { PrioridadHoy } from "@/components/predix/tablero/PrioridadHoy";
import { RecaudacionChart } from "@/components/predix/tablero/RecaudacionChart";
import type { Delegation, Period } from "@/components/predix/tablero/types";
import ReportExporter from "@/components/ReportExporter";
import { dashboardData } from "@/lib/predixDemoData";
import { useState } from "react";

export default function Tablero() {
  const [period, setPeriod] = useState<Period>("30d");
  const [delegation, setDelegation] = useState<Delegation>("todas");
  const data = dashboardData;

  return (
    <div className="container py-10">
      <PageHeader
        eyebrow="Tablero de dirección general"
        title="Decidir con anticipación, operar con precisión"
        description="Lectura integrada de recaudo, demanda, servicio y riesgos operativos para conducir la transformación del Instituto de Control Vehicular de Nuevo León."
        action={<ReportExporter rows={data.metrics.map((m) => ({ metrica: m.label, valor: m.value }))} />}
      />
      <DemoNotice text={data.notice} />

      <FiltrosAnalisis
        period={period}
        onPeriodChange={setPeriod}
        delegation={delegation}
        onDelegationChange={setDelegation}
        delegaciones={data.delegations.map((d) => d.name)}
      />

      <PrioridadHoy />

      {/* Conteos que siempre parten en filas parejas (1 / 2+2+2 / 3+3 / 6) —
          con 6 columnas por debajo de 1536px las tarjetas quedaban demasiado
          angostas para su propio valor. */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {data.metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.25fr_.75fr]">
        <RecaudacionChart revenueTrend={data.revenueTrend} period={period} />
        <DemandaChart demandMix={data.demandMix} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-[.9fr_1.1fr]">
        <AlertasPanel alerts={data.alerts} />
        <DesempenoDelegacion delegations={data.delegations} filter={delegation} />
      </div>
    </div>
  );
}
