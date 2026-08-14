/**
 * moduleLabels.ts — etiquetas visibles de los módulos de PREDIX-ICV.
 * Mantener sincronizado con server/_core/infra/permissions.ts → MODULES.
 */

export const MODULE_LABELS: Record<string, string> = {
  prediccion_demanda: "Motor de Predicción de Demanda",
  asignador_ventanillas: "Asignador Dinámico de Ventanillas",
  citas: "Sistema de Citas Inteligente",
  monitor: "Monitor de Operaciones en Tiempo Real",
  chatbot: "Asistente Virtual",
  admin: "Administración",
};

export const MODULE_DESCRIPTIONS: Record<string, string> = {
  prediccion_demanda: "Anticipa volumen y tipo de trámites por delegación, día y hora.",
  asignador_ventanillas: "Redistribuye ventanillas en tiempo real según la demanda.",
  citas: "Agenda con optimización automática de carga por delegación.",
  monitor: "KPIs operativos y alertas de saturación en tiempo real.",
  chatbot: "Asistente conversacional para consultas ciudadanas.",
  admin: "Gestión de usuarios, roles y auditoría del sistema.",
};
