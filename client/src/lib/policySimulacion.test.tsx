import { describe, expect, it } from "vitest";
import { simulateDiscountPolicy, buildPolicyEvidence } from "./policySimulacion";

describe("simulateDiscountPolicy", () => {
  it("computes a deterministic scenario within the 0-15 bound", () => {
    const result = simulateDiscountPolicy(6);
    expect(result.discountPct).toBe(6);
    expect(result.expectedCompletionPct).toBe(74);
    expect(result.projectedRevenueMillions).toBe(156);
    expect(result.recommendation).toContain("incentivo controlado");
  });

  it("clamps out-of-range input to [0, 15]", () => {
    expect(simulateDiscountPolicy(50).discountPct).toBe(15);
    expect(simulateDiscountPolicy(-5).discountPct).toBe(0);
  });
});

describe("buildPolicyEvidence", () => {
  const sources = [
    { name: "ICVNL", status: "Disponible", cadence: "Diaria" },
    { name: "REPUVE", status: "Sujeto a convenio", cadence: "Por definir" },
  ];

  it("filters to a single segment when one is selected", () => {
    const result = buildPolicyEvidence("regularizacion", sources);
    expect(result).toHaveLength(1);
    expect(result[0].segment).toBe("Regularización pendiente");
    expect(result[0].sources[0]).toEqual({ name: "ICVNL", status: "Disponible", cadence: "Diaria" });
  });

  it("returns all 3 segments for 'todos'", () => {
    expect(buildPolicyEvidence("todos", sources)).toHaveLength(3);
  });
});
