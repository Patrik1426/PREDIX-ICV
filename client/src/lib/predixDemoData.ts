// ============================================================
// predixDemoData — datos de ejemplo portados tal cual de
// predix-icvnl/server/predixDemoData.ts (mismos valores) — ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// Los colores fijos de demandMix se tradujeron a var(--color-chart-N) en
// el mismo orden en que aparecían en el origen — nunca se dejó un hex.
// ============================================================

export const DEMO_NOTICE_PREDIX =
  "Ambiente demostrativo: los indicadores y escenarios se presentan con datos sintéticos de referencia y no representan registros operativos oficiales.";

export const dashboardData = {
  generatedAt: "23 ago 2026 · 17:30 h",
  notice: DEMO_NOTICE_PREDIX,
  metrics: [
    { label: "Recaudación estimada", value: "$1,860M", change: "+8.4%", detail: "vs. mismo periodo anterior", tone: "orange" as const },
    { label: "Trámites atendidos", value: "294,208", change: "+4.1%", detail: "acumulado del periodo", tone: "navy" as const },
    { label: "Espera promedio", value: "12.8 min", change: "-2.7 min", detail: "meta institucional: < 15 min", tone: "green" as const },
    { label: "Cumplimiento operativo", value: "91.6%", change: "+1.9 pp", detail: "nivel de servicio comprometido", tone: "purple" as const },
    { label: "Experiencia de usuario", value: "4.6/5", change: "+0.2", detail: "1,284 encuestas de satisfacción", tone: "green" as const },
    { label: "Calidad del servicio", value: "92%", change: "+2.3 pp", detail: "evaluación favorable de la atención", tone: "navy" as const },
  ],
  revenueTrend: [
    { month: "Mar", actual: 178, forecast: 172 }, { month: "Abr", actual: 221, forecast: 214 }, { month: "May", actual: 132, forecast: 138 },
    { month: "Jun", actual: 126, forecast: 129 }, { month: "Jul", actual: 151, forecast: 147 }, { month: "Ago", actual: 164, forecast: 158 },
  ],
  demandMix: [
    { type: "Refrendo", value: 42, color: "var(--color-chart-1)" },
    { type: "Licencias", value: 24, color: "var(--color-chart-2)" },
    { type: "Altas y bajas", value: 19, color: "var(--color-chart-3)" },
    { type: "Regularización", value: 15, color: "var(--color-chart-4)" },
  ],
  delegations: [
    { name: "Pabellón Ciudadano", demand: 86, wait: 14, capacity: 82, status: "Estable" },
    { name: "San Nicolás", demand: 79, wait: 11, capacity: 76, status: "Estable" },
    { name: "Guadalupe", demand: 92, wait: 19, capacity: 94, status: "Atención" },
    { name: "Apodaca", demand: 71, wait: 9, capacity: 69, status: "Estable" },
  ] as const,
  alerts: [
    { severity: "high", title: "Guadalupe: saturación probable a las 11:00 h", detail: "Riesgo estimado de capacidad excedida: 78%.", action: "Preasignar 2 ventanillas multipropósito." },
    { severity: "medium", title: "Refrendo: pico de demanda previsto para el lunes", detail: "Volumen proyectado 16% superior a la línea base.", action: "Activar campaña de atención digital anticipada." },
    { severity: "low", title: "Pabellón Ciudadano: capacidad disponible", detail: "Disponibilidad proyectada de 18% durante 15:00–17:00 h.", action: "Redirigir citas no urgentes a esta franja." },
  ],
};

export const predictionData = {
  notice: DEMO_NOTICE_PREDIX,
  summary: { nextWeek: "+12.6%", risk: "Moderado", confidence: 87, capacityGap: 4 },
  series: [
    { day: "Lun 24", base: 1090, favorable: 1030, stress: 1220 }, { day: "Mar 25", base: 1135, favorable: 1060, stress: 1290 },
    { day: "Mié 26", base: 980, favorable: 930, stress: 1110 }, { day: "Jue 27", base: 1020, favorable: 960, stress: 1170 },
    { day: "Vie 28", base: 1160, favorable: 1090, stress: 1310 }, { day: "Sáb 29", base: 770, favorable: 720, stress: 900 },
    { day: "Lun 31", base: 1210, favorable: 1130, stress: 1370 },
  ],
  factors: [
    { label: "Calendario de descuentos", impact: "+5.1 pp", direction: "up", explanation: "Aumenta la intención de pago y visitas para refrendo." },
    { label: "Cierre de mes", impact: "+3.8 pp", direction: "up", explanation: "Concentra trámites pendientes de regularización." },
    { label: "Canal digital", impact: "-1.6 pp", direction: "down", explanation: "Desvía consultas y pagos de menor complejidad." },
  ],
  capacityPlan: [
    { delegation: "Guadalupe", current: 11, suggested: 13, reason: "Pico previsto 10:00–12:00 h" },
    { delegation: "Pabellón Ciudadano", current: 14, suggested: 14, reason: "Operación dentro del rango objetivo" },
    { delegation: "San Nicolás", current: 10, suggested: 11, reason: "Crecimiento de renovaciones" },
  ],
};

// "Pabellón Ciudadano"/"Pabellon" (nombre original del origen predix-icvnl)
// se renombró a "Monterrey" el 2026-08-31, para que coincida con el catálogo
// canónico de delegaciones (DEMO_DELEGACIONES en demoData.ts, usado por
// Tablero/Predicción y Asignación) — el campo `city` de la fila ya decía
// "Monterrey", así que el nombre real de la delegación quedaba inconsistente
// con su propia ciudad. `operationsData` solo lo consume esta página
// (verificado por grep antes del cambio), así que el rename es autocontenido.
export const operationsData = {
  notice: DEMO_NOTICE_PREDIX,
  userExperience: {
    experienceScore: 4.6, experienceDelta: "+0.2",
    serviceQualityPct: 92, serviceQualityDelta: "+2.3 pp",
    satisfactionPct: 91, satisfactionDelta: "+1.8 pp",
    nps: 64, surveyResponses: 1284, responseRate: 18.7, period: "Últimos 30 días",
    byDelegation: [
      { name: "Monterrey", score: 4.7, quality: 94, comments: 318, status: "Destacado" },
      { name: "San Nicolás", score: 4.6, quality: 93, comments: 246, status: "Sólido" },
      { name: "Guadalupe", score: 4.2, quality: 84, comments: 391, status: "Atención" },
      { name: "Apodaca", score: 4.5, quality: 91, comments: 207, status: "Sólido" },
    ],
    drivers: [
      { label: "Trato y amabilidad del personal", value: 95, note: "fortaleza percibida" },
      { label: "Claridad de requisitos e información", value: 90, note: "oportunidad de simplificación" },
      { label: "Resolución en la primera atención", value: 87, note: "seguimiento prioritario" },
      { label: "Tiempo de espera", value: 82, note: "principal fricción reportada" },
    ],
  },
  delegationStatus: [
    { name: "Monterrey", city: "Monterrey", queue: 18, wait: 14, capacity: 82, counters: "14 / 17", status: "Fluido" },
    { name: "Guadalupe", city: "Guadalupe", queue: 34, wait: 19, capacity: 94, counters: "11 / 12", status: "Saturación" },
    { name: "San Nicolás", city: "San Nicolás", queue: 13, wait: 11, capacity: 76, counters: "10 / 13", status: "Fluido" },
    { name: "Apodaca", city: "Apodaca", queue: 16, wait: 9, capacity: 69, counters: "9 / 13", status: "Fluido" },
  ],
  hourlyHeat: [
    { hour: "08", Monterrey: 44, Guadalupe: 68, "San Nicolás": 39, Apodaca: 32 },
    { hour: "09", Monterrey: 61, Guadalupe: 84, "San Nicolás": 57, Apodaca: 46 },
    { hour: "10", Monterrey: 78, Guadalupe: 97, "San Nicolás": 71, Apodaca: 63 },
    { hour: "11", Monterrey: 83, Guadalupe: 99, "San Nicolás": 76, Apodaca: 69 },
    { hour: "12", Monterrey: 77, Guadalupe: 92, "San Nicolás": 73, Apodaca: 64 },
    { hour: "13", Monterrey: 63, Guadalupe: 79, "San Nicolás": 59, Apodaca: 49 },
    { hour: "14", Monterrey: 51, Guadalupe: 64, "San Nicolás": 47, Apodaca: 39 },
  ],
  incidents: [
    { time: "10:18", delegation: "Guadalupe", type: "Tiempo de atención atípico", detail: "Alta vehicular supera 42 min en ventanilla 07.", owner: "Coordinación local" },
    { time: "09:42", delegation: "Monterrey", type: "Flujo digital", detail: "Incremento de asistencia por aclaraciones de pago.", owner: "Canal digital" },
    { time: "08:55", delegation: "San Nicolás", type: "Capacidad", detail: "Dos ventanillas disponibles para absorción de demanda.", owner: "Operación regional" },
  ],
};

export const policyData = {
  notice: DEMO_NOTICE_PREDIX,
  sources: [
    { code: "ICV", name: "ICVNL", description: "Trámites, recaudación, atención y delegaciones", status: "Disponible", category: "Interna", cadence: "Diaria", color: "orange" as const },
    { code: "INEGI", name: "INEGI", description: "Población, vivienda, movilidad y actividad económica", status: "Conector preparado", category: "Pública", cadence: "Trimestral", color: "navy" as const },
    { code: "REPUVE", name: "REPUVE", description: "Estatus registral y características vehiculares", status: "Sujeto a convenio", category: "Regulada", cadence: "Por definir", color: "gold" as const },
    { code: "ASEG", name: "Aseguradoras", description: "Señales agregadas de siniestralidad y cobertura", status: "Sujeto a convenio", category: "Alianza", cadence: "Mensual", color: "teal" as const },
    { code: "CONAPO", name: "CONAPO", description: "Índices de marginación y proyecciones demográficas", status: "Conector preparado", category: "Pública", cadence: "Anual", color: "purple" as const },
  ],
  segments: [
    { title: "Regularización pendiente", population: "26,400 expedientes", context: "Titularidad y actualización vehicular", priority: "Alta", sources: "ICVNL + REPUVE" },
    { title: "Población con barreras de acceso", population: "14 zonas de atención", context: "Distancia, conectividad y vulnerabilidad territorial", priority: "Alta", sources: "ICVNL + INEGI + CONAPO" },
    { title: "Personas cuidadoras y mayores", population: "18,900 trámites potenciales", context: "Necesidades de atención preferente", priority: "Media", sources: "ICVNL + CONAPO" },
  ],
  opportunities: [
    { id: "refrendo", title: "Descuento escalonado de refrendo", type: "Incentivo de recaudo", impact: "+9–14% de cumplimiento", detail: "Condicionar el incentivo temprano a capacidad digital y comunicación territorial.", tag: "Evaluar" },
    { id: "prioridad", title: "Jornadas prioritarias por territorio", type: "Acceso incluyente", impact: "-18% espera en zonas objetivo", detail: "Concentrar atención extendida en municipios con rezago y baja conectividad.", tag: "Diseñar" },
    { id: "titularidad", title: "Ruta de regularización de titularidad", type: "Formalización vehicular", impact: "11,500 trámites adicionales", detail: "Combinar cruces ICVNL–REPUVE, orientación digital y ventana temporal acotada.", tag: "Priorizar" },
  ],
};
