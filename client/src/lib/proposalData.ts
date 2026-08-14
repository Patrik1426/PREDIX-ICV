/**
 * proposalData.ts — contenido extraído literalmente de
 * docs/Propuesta PREDIX ICVNL Paco.docx (27-jul-2026).
 * Estas son las metas y el diagnóstico QUE PROPONE el documento entregado
 * al cliente — no datos operativos reales del ICVNL. Se muestran como
 * "metas del proyecto", nunca como métricas en vivo.
 */

export const DIAGNOSTICO = [
  {
    titulo: "Saturación estacional sin amortiguación",
    detalle: "Enero-abril concentra la mayor demanda por refrendo con descuento; sin redistribución de carga, se forman filas de horas.",
  },
  {
    titulo: "Asignación estática de ventanillas",
    detalle: "Una ventanilla de altas puede estar ociosa mientras la fila de refrendos crece, sin mecanismo de reasignación.",
  },
  {
    titulo: "Sin sistema de citas transversal",
    detalle: "\"Agiliza\" solo cubre Ponlo a Tu Nombre; ningún trámite más permite agendar hora y delegación óptima.",
  },
  {
    titulo: "Sin visibilidad en tiempo real",
    detalle: "El ciudadano no puede conocer aforo ni espera estimada antes de trasladarse a una delegación.",
  },
  {
    titulo: "Dependencia del canal presencial",
    detalle: "Fallas recurrentes en trámites digitalizables empujan al ciudadano de vuelta a la ventanilla física.",
  },
] as const;

export const RESULTADOS_ESPERADOS = [
  { metrica: "Tiempo de espera", cambio: "-40%", detalle: "de 45-120 min en pico a <20 min" },
  { metrica: "Throughput por delegación", cambio: "+25%", detalle: "trámites/día/delegación" },
  { metrica: "Tasa de abandono", cambio: "-60%", detalle: "ciudadanos que se van sin ser atendidos" },
  { metrica: "Horas-hombre por trámite", cambio: "-20%", detalle: "optimización de personal" },
  { metrica: "Quejas y reportes negativos", cambio: "-50%", detalle: "mejora en satisfacción" },
  { metrica: "Trámites por canal digital", cambio: "+35%", detalle: "desviados del canal presencial" },
] as const;

export const FASES = [
  { nombre: "Piloto", duracion: "3 meses", alcance: "2 delegaciones de alto volumen", entregable: "Validación del modelo predictivo" },
  { nombre: "Expansión", duracion: "4 meses", alcance: "Toda el área metropolitana de Monterrey", entregable: "Citas + asignación dinámica" },
  { nombre: "Consolidación", duracion: "3 meses", alcance: "Todo el estado de Nuevo León", entregable: "Plataforma operativa al 100%" },
  { nombre: "Optimización", duracion: "Continua", alcance: "Refinamiento de modelos", entregable: "Mejora continua basada en datos" },
] as const;

/** Capas de la arquitectura propuesta (sección 2.2 de la propuesta técnica). */
export const ARQUITECTURA_CAPAS = [
  { nombre: "Presentación", detalle: "Portal ciudadano · App móvil · Kioscos · Dashboard operativo" },
  { nombre: "Inteligencia", detalle: "Motor predictivo · Asignador dinámico · Optimizador de citas · Detector de anomalías" },
  { nombre: "Servicios", detalle: "API REST/tRPC · SSE tiempo real · Cola de mensajes · Scheduler" },
  { nombre: "Datos", detalle: "BD transaccional · Data warehouse · Cache · Logs/eventos" },
] as const;

/** Metas del proyecto a 12 meses (sección 8), usadas en el toggle demo/meta del hero. */
export const METAS_12_MESES = {
  tiempoEsperaMin: 20,
  tramitesConCitaPct: 40,
  satisfaccionSobre5: 4.2,
} as const;

/**
 * Los 3 modelos del motor de predicción (sección 3.1), cada uno con un
 * horizonte de tiempo distinto — se muestran sobre una misma regla temporal
 * en vez de una lista plana, porque el horizonte es la información real que
 * distingue a cada modelo. Rango en días para poder ubicarlos en la regla.
 */
export const PREDICCION_MODELOS = [
  {
    modelo: "XGBoost / LightGBM",
    aplicacion: "Demanda diaria por trámite y hora",
    horizonteLabel: "1-14 días",
    diasMin: 1,
    diasMax: 14,
  },
  {
    modelo: "SARIMA",
    aplicacion: "Volumen semanal por delegación",
    horizonteLabel: "4-12 semanas",
    diasMin: 28,
    diasMax: 84,
  },
  {
    modelo: "Prophet",
    aplicacion: "Tendencia + estacionalidad + eventos",
    horizonteLabel: "1-6 meses",
    diasMin: 30,
    diasMax: 180,
  },
] as const;

export const PREDICCION_ESCALA_DIAS = { min: 1, max: 200 } as const;

/** Qué produce el motor para cada delegación/trámite/hora, listo para el resto de módulos. */
export const PREDICCION_SALIDAS = [
  { titulo: "Curva de llegadas", detalle: "Distribución horaria de la demanda esperada" },
  { titulo: "Probabilidad de saturación", detalle: "Por franja horaria, para anticipar picos" },
  { titulo: "Ventanillas mínimas recomendadas", detalle: "Capacidad requerida por delegación y hora" },
] as const;

/** Asignador — función objetivo y restricciones reales (sección 3.2). */
export const ASIGNADOR_OBJETIVO = "Minimizar el tiempo promedio de espera del ciudadano";
export const ASIGNADOR_RESTRICCIONES = [
  "Capacitación del personal por ventanilla",
  "Equipo disponible en cada caja",
  "Prioridad de trámites urgentes",
] as const;

/** Citas — ciclo de vida real de una cita (sección 3.3), sí es una secuencia genuina. */
export const CITAS_CICLO = [
  { paso: "Solicitud", detalle: "El ciudadano elige el trámite en portal, app o WhatsApp" },
  { paso: "Recomendación", detalle: "El sistema sugiere delegación y horario con menor espera prevista" },
  { paso: "Confirmación", detalle: "Confirmación inmediata, sin esperar aprobación manual" },
  { paso: "Recordatorio", detalle: "Aviso automático antes de la cita" },
  { paso: "Reprogramación", detalle: "Sin penalización si el ciudadano necesita cambiar la fecha" },
] as const;

export const CITAS_CANALES = ["Portal web", "App móvil", "WhatsApp"] as const;

/** Monitor — KPIs y metas reales del panel operativo (sección 3.4). */
export const MONITOR_KPIS = [
  { indicador: "Tiempo de espera", meta: "< 15 min" },
  { indicador: "Ocupación de ventanillas", meta: "75-85%" },
  { indicador: "Tasa de abandono", meta: "< 5%" },
  { indicador: "Satisfacción ciudadana", meta: "> 4.0/5.0" },
] as const;

export const MONITOR_ALERTAS = [
  { titulo: "Saturación inminente", detalle: "Probabilidad de exceder capacidad en las próximas 2 horas" },
  { titulo: "Personal insuficiente", detalle: "Para la demanda predicha del día siguiente" },
  { titulo: "Anomalías de atención", detalle: "Tiempos fuera de rango — posible falla técnica o de capacitación" },
] as const;

/** Asistente — capacidades reales (sección 3.5) + el impacto estimado como cifra destacada. */
export const CHATBOT_CAPACIDADES = [
  { titulo: "Requisitos y estado de cuenta", detalle: "Resuelve dudas documentales y adeudos vehiculares" },
  { titulo: "Recomendación de horario", detalle: "Delegación y hora con menor espera prevista" },
  { titulo: "Agenda desde el chat", detalle: "Cita directa dentro de la conversación" },
] as const;

export const CHATBOT_IMPACTO = {
  pct: "30-40%",
  detalle: "de las visitas presenciales son consultas que podrían resolverse digitalmente",
} as const;

/** Admin — ya tiene backend real; falta solo la pantalla. */
export const ADMIN_CAPACIDADES = [
  { titulo: "Usuarios y roles", detalle: "Gestión de cuentas institucionales y matriz de permisos por rol" },
  { titulo: "Auditoría", detalle: "Registro de acciones (audit_log) por usuario y módulo" },
] as const;

export const STACK_TECNOLOGICO = [
  { capa: "Frontend web", tecnologia: "React 19 + Tailwind CSS 4" },
  { capa: "Backend API", tecnologia: "Node.js + Express + tRPC" },
  { capa: "Base de datos", tecnologia: "MySQL 8.0 / TiDB" },
  { capa: "Motor ML", tecnologia: "Python — scikit-learn, Prophet, XGBoost" },
  { capa: "Tiempo real", tecnologia: "Server-Sent Events + WebSockets" },
  { capa: "Mensajería", tecnologia: "WhatsApp Business API" },
] as const;
