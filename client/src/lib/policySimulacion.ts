// ============================================================
// policySimulacion — lógica pura de simulación para PolicyStudio,
// portada de predix-icvnl (shared/predix.ts + server/policyEvidence.ts).
// 100% cálculo client-side, sin llamada a backend — ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// ============================================================

export type DiscountSimulation = {
  discountPct: number;
  expectedCompletionPct: number;
  projectedRevenueMillions: number;
  incrementalProcedures: number;
  recommendation: string;
};

/** Escenario demostrativo determinista. Valores de producción deben validarse con el ICVNL. */
export function simulateDiscountPolicy(discountPct: number): DiscountSimulation {
  const boundedDiscount = Math.min(15, Math.max(0, discountPct));
  const expectedCompletionPct = Math.round(61 + boundedDiscount * 2.15);
  const projectedRevenueMillions = Math.round(128 + boundedDiscount * 4.6);
  const incrementalProcedures = Math.round(8200 + boundedDiscount * 1210);
  return {
    discountPct: boundedDiscount,
    expectedCompletionPct,
    projectedRevenueMillions,
    incrementalProcedures,
    recommendation:
      boundedDiscount <= 7
        ? "Escenario de incentivo controlado: favorece recaudo temprano y estabilidad operativa."
        : "Escenario expansivo: requiere validar suficiencia presupuestal y capacidad de atención antes de operar.",
  };
}

type PolicySegment = "todos" | "regularizacion" | "acceso" | "atencion";
type PolicySource = { name: string; status: string; cadence: string };

const evidenceDefinitions = [
  {
    id: "regularizacion" as const,
    segment: "Regularización pendiente",
    sources: [],
    signal: "Coincidencia de expedientes con actualización de titularidad pendiente",
    indicator: "26,400 expedientes potenciales",
    intervention: "Ruta temporal de formalización con orientación asistida",
  },
  {
    id: "acceso" as const,
    segment: "Población con barreras de acceso",
    sources: ["INEGI", "CONAPO"],
    signal: "Territorios con presión de atención y condiciones de acceso diferenciadas",
    indicator: "14 zonas priorizables",
    intervention: "Jornadas territoriales y acompañamiento digital",
  },
  {
    id: "atencion" as const,
    segment: "Personas cuidadoras y mayores",
    sources: ["CONAPO", "Aseguradoras"],
    signal: "Necesidad de atención preferente y orientación multicanal",
    indicator: "18,900 trámites potenciales",
    intervention: "Franjas prioritarias y esquema de cita asistida",
  },
];

export function buildPolicyEvidence(segment: PolicySegment, availableSources: PolicySource[]) {
  const selected = segment === "todos" ? evidenceDefinitions : evidenceDefinitions.filter((item) => item.id === segment);
  return selected.map((item) => ({
    ...item,
    sources: item.sources.map((sourceName) => {
      const source = availableSources.find((candidate) => candidate.name === sourceName);
      return { name: sourceName, status: source?.status ?? "No mapeada", cadence: source?.cadence ?? "Por definir" };
    }),
  }));
}
