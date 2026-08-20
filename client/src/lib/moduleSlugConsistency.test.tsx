// ============================================================
// moduleSlugConsistency — guarda de drift entre los 5 diccionarios que
// deben describir el mismo conjunto de 4 slugs de UI (prediccion_asignacion,
// citas_operacion, chatbot, admin): MODULE_GROUPS (moduleGroups.ts),
// MODULE_LABELS/MODULE_DESCRIPTIONS (moduleLabels.ts), MODULE_ICONS/
// MODULE_ORDER/MODULE_ACCENT (moduleIcons.tsx), MODULE_DESARROLLO
// (demo/ModuloDesarrollo.tsx) y MODULE_PREVIEWS (pages/ModuloDetalle.tsx).
// MODULE_ORDER (subset intencional, 3 no-admin) y MODULE_PREVIEWS (subset
// porque "admin" todavía no tiene pantalla propia — cae en el fallback de
// ModuloDetalle.tsx) se verifican como subconjunto en vez de match exacto.
//
// Nota de extensión: este archivo no tiene JSX, pero debe llamarse
// `.test.tsx` — vitest.config.ts (`include`) solo recoge tests de cliente
// con ese sufijo; `client/src/**/*.test.ts` no se ejecuta en absoluto. Un
// archivo `.test.ts` aquí nunca correría, exactamente el modo de falla que
// esta guarda existe para prevenir (ver hallazgo #6 de la revisión final).
//
// Deliberadamente NO se introduce un tipo unión `UiModuleSlug` compartido
// entre los 5 archivos — tocaría las firmas de tipo de los 5 y es más
// invasivo de lo que amerita este arreglo; esta prueba es la versión
// acotada y de menor riesgo de la misma protección.
// ============================================================

import { describe, expect, it } from "vitest";
import { MODULE_GROUPS } from "./moduleGroups";
import { MODULE_LABELS, MODULE_DESCRIPTIONS } from "./moduleLabels";
import { MODULE_ICONS, MODULE_ORDER, MODULE_ACCENT } from "./moduleIcons";
import { MODULE_DESARROLLO } from "@/components/demo/ModuloDesarrollo";
import { MODULE_PREVIEWS } from "@/pages/ModuloDetalle";

const EXPECTED_SLUGS = ["prediccion_asignacion", "citas_operacion", "chatbot", "admin"].sort();

function sortedKeys(obj: Record<string, unknown>): string[] {
  return Object.keys(obj).sort();
}

describe("module slug dictionaries stay in sync", () => {
  it("MODULE_GROUPS describes exactly the 4 UI slugs", () => {
    expect(sortedKeys(MODULE_GROUPS)).toEqual(EXPECTED_SLUGS);
  });

  it("MODULE_LABELS describes exactly the 4 UI slugs", () => {
    expect(sortedKeys(MODULE_LABELS)).toEqual(EXPECTED_SLUGS);
  });

  it("MODULE_DESCRIPTIONS describes exactly the 4 UI slugs", () => {
    expect(sortedKeys(MODULE_DESCRIPTIONS)).toEqual(EXPECTED_SLUGS);
  });

  it("MODULE_ICONS describes exactly the 4 UI slugs", () => {
    expect(sortedKeys(MODULE_ICONS)).toEqual(EXPECTED_SLUGS);
  });

  it("MODULE_ACCENT describes exactly the 4 UI slugs", () => {
    expect(sortedKeys(MODULE_ACCENT)).toEqual(EXPECTED_SLUGS);
  });

  it("MODULE_DESARROLLO describes exactly the 4 UI slugs", () => {
    expect(sortedKeys(MODULE_DESARROLLO)).toEqual(EXPECTED_SLUGS);
  });

  // MODULE_PREVIEWS es distinto de los otros 4: ModuloDetalle.tsx tiene un
  // fallback explícito ("Sin vista previa disponible todavía") para
  // cualquier slug sin componente registrado — hoy "admin" cae ahí a
  // propósito (su pantalla todavía no existe, ver ModuloDesarrollo.tsx).
  // Así que es un subconjunto válido, no un match exacto — pero cualquier
  // clave que NO esté en el set de 4 slugs canónicos sí sería drift real.
  it("MODULE_PREVIEWS only contains keys from the 4 canonical UI slugs", () => {
    for (const key of sortedKeys(MODULE_PREVIEWS)) {
      expect(EXPECTED_SLUGS).toContain(key);
    }
  });

  it("MODULE_ORDER is intentionally the 3 non-admin slugs — a subset, not an exact match", () => {
    const order = [...MODULE_ORDER];
    expect(order).not.toContain("admin");
    for (const slug of order) {
      expect(EXPECTED_SLUGS).toContain(slug);
    }
    expect(order.sort()).toEqual(EXPECTED_SLUGS.filter((s) => s !== "admin"));
  });

  // Orden real de prioridad del ICVNL (cuestionario de dimensionamiento
  // respondido 2026-08-19, bloque 7.6): Asistente Virtual Predictivo #1,
  // Sistema de Citas Inteligente #2 + Monitor de Operaciones #3 (ambos caen
  // en citas_operacion), Asignador Dinámico #4 + Motor de Predicción #5
  // (ambos caen en prediccion_asignacion). Ya no es un orden de flujo
  // operativo asumido por nosotros.
  it("MODULE_ORDER reflects the ICVNL's real stated priority (chatbot > citas_operacion > prediccion_asignacion)", () => {
    expect(MODULE_ORDER).toEqual(["chatbot", "citas_operacion", "prediccion_asignacion"]);
  });
});
