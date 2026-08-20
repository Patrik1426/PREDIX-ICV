/**
 * demoData.ts — datos de ejemplo para la demo visual de PREDIX-ICV.
 * NINGÚN valor aquí proviene del ICVNL: son solo para ilustrar cómo se vería
 * cada módulo una vez construido. No inventar datos de negocio reales; todo lo
 * que consuma esto debe mostrar la leyenda "Datos de ejemplo".
 */

export const DEMO_DELEGACIONES = [
  { nombre: "Monterrey Centro", ocupacion: 0.86, estado: "saturado" as const },
  { nombre: "San Nicolás", ocupacion: 0.62, estado: "moderado" as const },
  { nombre: "Guadalupe", ocupacion: 0.34, estado: "fluido" as const },
  { nombre: "Apodaca", ocupacion: 0.51, estado: "moderado" as const },
  { nombre: "San Pedro", ocupacion: 0.21, estado: "fluido" as const },
];

export const DEMO_KPIS = {
  tiempoEsperaPromedioMin: 14,
  tramitesProyectadosHoy: 2840,
  delegacionesEnAlerta: 1,
  tramitesConCitaPct: 22,
};

// Curva horaria de demanda proyectada (0-23h), pico en refrendo matutino.
export const DEMO_DEMANDA_HORARIA = [
  12, 8, 5, 4, 6, 18, 42, 68, 81, 74, 60, 55, 58, 62, 57, 49, 44, 38, 25, 16, 10, 7, 5, 4,
];

// Desglose de la demanda horaria por tipo de trámite — proporciones fijas
// aplicadas sobre DEMO_DEMANDA_HORARIA (no series inventadas sueltas, cada
// hora sigue sumando al mismo total agregado). Refrendo domina por ser el
// trámite de mayor volumen real del ICVNL (temporada ene-abr, ver
// docs/CUESTIONARIO_RESPUESTAS_ICVNL.md), el resto en proporción
// decreciente. Suma de shares = 1.
export const DEMO_DEMANDA_POR_TRAMITE = [
  { tramite: "Refrendo", share: 0.45 },
  { tramite: "Licencias", share: 0.25 },
  { tramite: "Altas y bajas", share: 0.2 },
  { tramite: "Ponlo a tu Nombre", share: 0.1 },
].map((t) => ({
  ...t,
  valores: DEMO_DEMANDA_HORARIA.map((v) => Math.round(v * t.share)),
}));

export const DEMO_VENTANILLAS = [
  { ventanilla: "V1", tramite: "Refrendo", carga: 0.9 },
  { ventanilla: "V2", tramite: "Refrendo", carga: 0.85 },
  { ventanilla: "V3", tramite: "Licencias", carga: 0.4 },
  { ventanilla: "V4", tramite: "Altas y bajas", carga: 0.55 },
  { ventanilla: "V5", tramite: "Ponlo a tu Nombre", carga: 0.3 },
];

export const DEMO_CITAS_SEMANA = [
  { dia: "Lun", ocupacion: 0.7 },
  { dia: "Mar", ocupacion: 0.55 },
  { dia: "Mié", ocupacion: 0.4 },
  { dia: "Jue", ocupacion: 0.6 },
  { dia: "Vie", ocupacion: 0.88 },
  { dia: "Sáb", ocupacion: 0.32 },
];

// Escenarios de reasignación — de la tabla "Mecanismo de operación" de la
// propuesta (sección 3.2). Cada uno recalcula la distribución de ventanillas.
export const DEMO_ESCENARIOS_ASIGNACION = [
  {
    id: "base",
    etiqueta: "Estado actual",
    accion: "Configuración fija del día.",
    ventanillas: [
      { ventanilla: "V1", tramite: "Refrendo", carga: 0.9 },
      { ventanilla: "V2", tramite: "Refrendo", carga: 0.85 },
      { ventanilla: "V3", tramite: "Licencias", carga: 0.4 },
      { ventanilla: "V4", tramite: "Altas y bajas", carga: 0.55 },
      { ventanilla: "V5", tramite: "Ponlo a tu Nombre", carga: 0.3 },
    ],
  },
  {
    id: "pico_refrendo",
    etiqueta: "Fila de refrendos > 30 personas",
    accion: "Reasignar 2 ventanillas de altas a refrendo.",
    ventanillas: [
      { ventanilla: "V1", tramite: "Refrendo", carga: 0.65 },
      { ventanilla: "V2", tramite: "Refrendo", carga: 0.6 },
      { ventanilla: "V3", tramite: "Refrendo", carga: 0.55 },
      { ventanilla: "V4", tramite: "Refrendo", carga: 0.5 },
      { ventanilla: "V5", tramite: "Ponlo a tu Nombre", carga: 0.3 },
    ],
  },
  {
    id: "ventanilla_ociosa",
    etiqueta: "Ventanilla ociosa > 10 min",
    accion: "Absorbe la fila compatible más larga.",
    ventanillas: [
      { ventanilla: "V1", tramite: "Refrendo", carga: 0.7 },
      { ventanilla: "V2", tramite: "Refrendo", carga: 0.68 },
      { ventanilla: "V3", tramite: "Licencias", carga: 0.4 },
      { ventanilla: "V4", tramite: "Refrendo", carga: 0.62 },
      { ventanilla: "V5", tramite: "Ponlo a tu Nombre", carga: 0.3 },
    ],
  },
] as const;

// Escenarios de carga operativa — mismo patrón que DEMO_ESCENARIOS_ASIGNACION,
// para el Monitor de Operaciones. "temporada_alta" está anclado a un dato real:
// el ICVNL reportó en el cuestionario de dimensionamiento (2026-08-19, ver
// docs/CUESTIONARIO_RESPUESTAS_ICVNL.md bloque 7.1) un incremento de hasta
// 1000% en el periodo de refrendo (enero-abril) respecto al promedio anual —
// los números de este escenario son ilustrativos, no ese 1000% literal
// (llevarían el demo a valores absurdos), pero la nota lo cita para que el
// escenario no sea un número inventado sin respaldo.
export const DEMO_ESCENARIOS_MONITOR = [
  {
    id: "normal",
    etiqueta: "Demanda normal",
    nota: null,
    capacidadPct: 58,
    esperando: 24,
    tiempoEsperaPromedioMin: 11,
    tramitesProyectadosHoy: 2100,
  },
  {
    id: "hora_pico",
    etiqueta: "Hora pico",
    nota: "Pico matutino típico, ver la curva de Demanda por hora (9-11h).",
    capacidadPct: 88,
    esperando: 61,
    tiempoEsperaPromedioMin: 24,
    tramitesProyectadosHoy: 3400,
  },
  {
    id: "temporada_alta",
    etiqueta: "Temporada alta (ene-abr)",
    nota: "El ICVNL reportó un incremento de hasta 1000% en el periodo de refrendo (ene-abr) respecto al promedio anual — cifra real del cuestionario de dimensionamiento, no de este demo.",
    capacidadPct: 97,
    esperando: 89,
    tiempoEsperaPromedioMin: 39,
    tramitesProyectadosHoy: 5200,
  },
] as const;

// Slots por hora — tabla real de la sección 3.3 de la propuesta (día de
// mayor demanda, ilustrativo de cómo varía la capacidad de citas vs walk-in).
export const DEMO_SLOTS_CITAS = [
  { hora: "7-8", demandaWalkIn: 15, slotsCita: 10, capacidadTotal: 25 },
  { hora: "8-9", demandaWalkIn: 25, slotsCita: 7, capacidadTotal: 32 },
  { hora: "9-11", demandaWalkIn: 40, slotsCita: 4, capacidadTotal: 44 },
  { hora: "11-13", demandaWalkIn: 30, slotsCita: 8, capacidadTotal: 38 },
  { hora: "13-16", demandaWalkIn: 20, slotsCita: 12, capacidadTotal: 32 },
] as const;

// Matriz de competencias — de qué trámites puede encargarse cada empleado
// (sección 3.2, "Capacitación cruzada del personal"). Nombres y asignación
// son de ejemplo, la estructura de la matriz es la real.
export const DEMO_TRAMITES = ["Refrendo", "Licencias", "Altas y bajas", "Ponlo a tu Nombre"] as const;

export const DEMO_MATRIZ_COMPETENCIAS = [
  { empleado: "Ana R.", tramites: ["Refrendo", "Licencias"] },
  { empleado: "Luis M.", tramites: ["Refrendo", "Altas y bajas"] },
  { empleado: "Marta G.", tramites: ["Licencias", "Ponlo a tu Nombre", "Altas y bajas"] },
  { empleado: "Jorge T.", tramites: ["Refrendo", "Ponlo a tu Nombre"] },
] as const;

// Datos de ejemplo para la vista previa de Monitor de Operaciones — estado
// de fila agregado y ventanillas activas de una delegación de ejemplo.
import type { EstadoOperativo } from "@/components/dashboard";

export const DEMO_ESTADO_FILA = {
  esperando: 42,
  capacidadPct: 70,
  tiempoEstimadoMin: 18,
};

export const DEMO_VENTANILLAS_MONITOR: {
  ventanilla: string;
  operador: string;
  tramite: string;
  tiempoMin: number;
  atendidos: number;
  estado: EstadoOperativo;
}[] = [
  { ventanilla: "V4", operador: "Juan P.", tramite: "Renovación de Licencias", tiempoMin: 12, atendidos: 8, estado: "fluido" },
  { ventanilla: "V2", operador: "Ana R.", tramite: "Refrendo", tiempoMin: 24, atendidos: 5, estado: "presion" },
  { ventanilla: "V5", operador: "Marta G.", tramite: "Altas y bajas", tiempoMin: 31, atendidos: 3, estado: "saturado" },
];

// Datos de ejemplo para el pulido visual de los previews de Predicción,
// Citas y Asistente Virtual (demo de junta con el cliente) — ninguno de
// estos valores proviene del ICVNL.
export const DEMO_PRECISION_MODELO = 91; // % — precisión ilustrativa del modelo de predicción

export const DEMO_CITAS_HOY_KPIS = {
  citasHoy: 142,
  enEspera: 12,
};

export const DEMO_PROXIMAS_ATENCIONES = [
  { hora: "09:15", nombre: "Martínez, Ana Paula", tramite: "Trámite General", estado: "En sala" },
  { hora: "09:30", nombre: "Gómez Ruiz, Carlos", tramite: "Renovación", estado: "Programada" },
  { hora: "09:45", nombre: "Reyes Ibarra, Sofía", tramite: "Altas y bajas", estado: "Programada" },
] as const;
