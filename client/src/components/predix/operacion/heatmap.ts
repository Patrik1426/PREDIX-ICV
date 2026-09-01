import type { operationsData } from "@/lib/predixDemoData";

type HourlyHeatRow = (typeof operationsData)["hourlyHeat"][number];

// `HourlyHeatRow` es un objeto {hour, [delegación]: number} — las claves de
// delegación son dinámicas por diseño (una por cada delegación del demo), así
// que leerlas por nombre requiere este único cast controlado en vez de
// repetirlo en cada archivo que necesita el valor de una delegación puntual
// (MatrizDemanda.tsx y AccionSugerida.tsx).
export function getDelegationHeatValue(row: HourlyHeatRow, delegationName: string): number {
  return (row as unknown as Record<string, number>)[delegationName];
}

export const heatColor = (value: number) =>
  value >= 92 ? "bg-destructive text-destructive-foreground" :
  value >= 78 ? "bg-chart-2 text-foreground" :
  value >= 60 ? "bg-chart-2/30 text-foreground" :
  "bg-success/15 text-success";
