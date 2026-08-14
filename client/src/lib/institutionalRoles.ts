/**
 * institutionalRoles.ts — mapeo entre los 4 roles institucionales del ICVNL
 * (users.institutionalRole) y su etiqueta en español.
 */

export const INSTITUTIONAL_ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  director: "Dirección",
  coordinador: "Coordinación de Delegación",
  cajero: "Personal de Ventanilla",
};

/** Inverso del mapa anterior — label visible → slug institucional real. */
export const ROLE_LABEL_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(INSTITUTIONAL_ROLE_LABELS).map(([slug, label]) => [label, slug])
);
