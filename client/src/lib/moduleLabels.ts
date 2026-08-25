// client/src/lib/moduleLabels.ts
/**
 * moduleLabels.ts — etiquetas visibles de los módulos de PREDIX-ICV.
 * "prediccion_asignacion" y "citas_operacion" son slugs de UI (fusionan 2
 * módulos RBAC cada uno, ver @/lib/moduleGroups) — no existen como MODULES
 * en server/_core/infra/permissions.ts, el RBAC real sigue siendo granular.
 */

export const MODULE_LABELS: Record<string, string> = {
  prediccion_asignacion: "Predicción y Asignación",
  citas_operacion: "Operación Institucional",
  chatbot: "Asistente Virtual",
  admin: "Administración",
};

export const MODULE_DESCRIPTIONS: Record<string, string> = {
  prediccion_asignacion: "Anticipa la demanda y redistribuye ventanillas en tiempo real.",
  citas_operacion: "Monitoreo en vivo de experiencia, capacidad e incidencias por delegación.",
  chatbot: "Asistente conversacional para consultas ciudadanas.",
  admin: "Gestión de usuarios, roles y auditoría del sistema.",
};
