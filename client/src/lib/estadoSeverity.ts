type EstadoSeverityOptions = {
  /** Estados que cuentan como "malo" (rojo). Por defecto solo "Atención". */
  malos?: readonly string[];
  /** Estados que se destacan aparte, ni buenos ni malos (acento primario). */
  destacados?: readonly string[];
};

// Generalizado 2026-08-31 (refactor de "Operación Institucional") para servir
// tanto al caso original de 2 estados (bueno/"Atención") como a los 2 casos
// nuevos de esta página: 2 estados con otro literal "malo" ("Saturación") y
// 3 estados con un tercer valor destacado ("Destacado"). Sin opciones, el
// comportamiento es idéntico al de antes — DesempenoDelegacion.tsx (Tablero)
// sigue llamando getEstadoBadgeClass(item.status) sin cambios.
export function getEstadoBadgeClass(status: string, options?: EstadoSeverityOptions): string {
  const malos = options?.malos ?? ["Atención"];
  const destacados = options?.destacados ?? [];
  if (destacados.includes(status)) return "bg-primary/10 text-primary";
  if (malos.includes(status)) return "bg-destructive/10 text-destructive";
  return "bg-success/10 text-success";
}
