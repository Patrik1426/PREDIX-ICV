// Puente entre los slugs de UI (páginas fusionadas que ve el usuario) y los
// slugs reales de RBAC (server/_core/infra/permissions.ts → MODULES). La
// fusión de páginas es solo visual — el permiso real sigue siendo por slug
// granular; esto solo decide si el ítem de nav/ruta/tab agrupado debe
// mostrarse. Ver docs/superpowers/specs/2026-08-17-consolidacion-3-modulos-design.md.

export const MODULE_GROUPS: Record<string, string[]> = {
  prediccion_asignacion: ["prediccion_demanda", "asignador_ventanillas"],
  citas_operacion: ["citas", "monitor"],
  chatbot: ["chatbot"],
  admin: ["admin"],
};

export function hasGroupAccess(
  uiSlug: string,
  accessibleModules: string[] | undefined | null
): boolean {
  const realSlugs = MODULE_GROUPS[uiSlug];
  if (!realSlugs) return false;
  const modules = accessibleModules ?? [];
  return realSlugs.some((slug) => modules.includes(slug));
}
