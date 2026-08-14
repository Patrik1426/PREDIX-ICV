// Módulos de PREDIX-ICV — los 5 de la propuesta (docs/Propuesta PREDIX ICVNL
// Paco.docx) + Asistente Virtual + Administración. Ninguno tiene pantalla
// real todavía salvo Administración/Asistente — se agregan aquí primero
// porque el RBAC es transversal a todos desde el día uno.
export const MODULES = {
  PREDICCION_DEMANDA: "prediccion_demanda",
  ASIGNADOR_VENTANILLAS: "asignador_ventanillas",
  CITAS: "citas",
  MONITOR: "monitor",
  CHATBOT: "chatbot",
  ADMIN: "admin",
} as const;

export type ModuleName = (typeof MODULES)[keyof typeof MODULES];
export type PermissionAction = "canView" | "canEdit" | "canDelete" | "canExport";

// Roles institucionales del ICVNL (ver Bloque 7.4 del cuestionario de
// dimensionamiento: dirección, coordinación de delegación, personal de
// ventanilla). "admin" es administración del sistema, no un rol operativo
// del ICVNL — mismo criterio que seguridad-edomex.
export const DEFAULT_PERMISSIONS = {
  cajero: {
    [MODULES.PREDICCION_DEMANDA]: { canView: 0, canEdit: 0, canDelete: 0, canExport: 0 },
    [MODULES.ASIGNADOR_VENTANILLAS]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 0 },
    [MODULES.CITAS]: { canView: 1, canEdit: 1, canDelete: 0, canExport: 0 },
    [MODULES.MONITOR]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 0 },
    [MODULES.CHATBOT]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 0 },
    [MODULES.ADMIN]: { canView: 0, canEdit: 0, canDelete: 0, canExport: 0 },
  },
  coordinador: {
    [MODULES.PREDICCION_DEMANDA]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 1 },
    [MODULES.ASIGNADOR_VENTANILLAS]: { canView: 1, canEdit: 1, canDelete: 0, canExport: 0 },
    [MODULES.CITAS]: { canView: 1, canEdit: 1, canDelete: 0, canExport: 1 },
    [MODULES.MONITOR]: { canView: 1, canEdit: 1, canDelete: 0, canExport: 1 },
    [MODULES.CHATBOT]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 0 },
    [MODULES.ADMIN]: { canView: 0, canEdit: 0, canDelete: 0, canExport: 0 },
  },
  director: {
    [MODULES.PREDICCION_DEMANDA]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 1 },
    [MODULES.ASIGNADOR_VENTANILLAS]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 1 },
    [MODULES.CITAS]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 1 },
    [MODULES.MONITOR]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 1 },
    [MODULES.CHATBOT]: { canView: 1, canEdit: 0, canDelete: 0, canExport: 0 },
    [MODULES.ADMIN]: { canView: 0, canEdit: 0, canDelete: 0, canExport: 0 },
  },
  admin: {
    [MODULES.PREDICCION_DEMANDA]: { canView: 1, canEdit: 1, canDelete: 1, canExport: 1 },
    [MODULES.ASIGNADOR_VENTANILLAS]: { canView: 1, canEdit: 1, canDelete: 1, canExport: 1 },
    [MODULES.CITAS]: { canView: 1, canEdit: 1, canDelete: 1, canExport: 1 },
    [MODULES.MONITOR]: { canView: 1, canEdit: 1, canDelete: 1, canExport: 1 },
    [MODULES.CHATBOT]: { canView: 1, canEdit: 1, canDelete: 1, canExport: 1 },
    [MODULES.ADMIN]: { canView: 1, canEdit: 1, canDelete: 1, canExport: 1 },
  },
} as const;
