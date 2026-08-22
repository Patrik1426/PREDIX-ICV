import { useEffect, useRef, ReactNode } from "react";
import {
  BrainCircuit,
  CalendarClock,
  MapPin,
  BarChart3,
  MessageSquare,
  Server,
  CheckCircle2,
  ArrowRight,
  Layers,
  Cpu,
  Database,
  Globe,
} from "lucide-react";

const S = {
  surface: "oklch(1 0 0)",
  surface2: "oklch(0.95 0.008 50)",
  surface3: "oklch(0.94 0.05 55)",
  border: "oklch(0.91 0.006 50)",
  brand: "oklch(0.70 0.17 54)",
  coral: "oklch(0.58 0.20 28)",
  ink: "oklch(0.22 0.01 50)",
  muted: "oklch(0.48 0.01 50)",
  ok: "oklch(0.62 0.14 145)",
  warn: "oklch(0.75 0.15 75)",
};

const MTY_BG = "https://images.unsplash.com/photo-1580279982082-7392b4369815?w=1400&h=560&fit=crop&auto=format";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("in"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const diagnostics = [
  { label: "TIEMPO ESPERA ACTUAL", value: "34 min", color: "oklch(0.58 0.20 28)" },
  { label: "TRÁMITES/HORA", value: "28", color: S.warn },
  { label: "CITAS CUMPLIDAS", value: "51%", color: S.warn },
  { label: "COSTO INEFICIENCIA", value: "$12.4M MXN/año", color: "oklch(0.58 0.20 28)" },
];

const modules = [
  {
    num: "01",
    title: "Predicción de Demanda",
    icon: BrainCircuit,
    desc: "Modelos de ML entrenados con datos históricos de ICVNL predicen el volumen de trámites por hora, delegación y tipo — con 48h de anticipación y precisión ≥96%.",
    benefits: ["Anticipación de picos con 48h de aviso", "Precisión ≥96% en demanda horaria", "Modelo re-entrenado semanalmente"],
  },
  {
    num: "02",
    title: "Asignación Inteligente",
    icon: Layers,
    desc: "El motor de optimización distribuye la carga entre delegaciones en tiempo real, equilibrando capacidad instalada y demanda proyectada para eliminar colas innecesarias.",
    benefits: ["Balanceo automático inter-delegación", "Reducción de tiempo de espera -40%", "Reglas configurables por autoridad"],
  },
  {
    num: "03",
    title: "Citas y Operación",
    icon: CalendarClock,
    desc: "Sistema de agendamiento que distribuye citas según la curva de demanda predicha, evitando saturación en hora pico y dejando capacidad de reserva para urgencias.",
    benefits: ["Citas distribuidas por curva predictiva", "Recordatorios automáticos SMS/email", "Cola virtual eliminando filas físicas"],
  },
  {
    num: "04",
    title: "Mapa de Ocupación",
    icon: MapPin,
    desc: "Vista geoespacial del área metropolitana de Monterrey con niveles de saturación en tiempo real, alertas automáticas y redireccionamiento ciudadano inteligente.",
    benefits: ["9 delegaciones del AMM en tiempo real", "Alertas push a ciudadanos", "Redirección automática cuando >85%"],
  },
  {
    num: "05",
    title: "Asistente IA",
    icon: MessageSquare,
    desc: "Chatbot con LLM fine-tuned sobre datos operativos de ICVNL: responde consultas de estado, guía trámites, agenda citas y escala a humano cuando es necesario.",
    benefits: ["Disponible 24/7 en web y app", "Integración con módulos de citas", "Escalado a agente humano sin fricción"],
  },
];

const archLayers = [
  {
    label: "PRESENTACIÓN",
    color: S.brand,
    items: ["Portal Ciudadano", "Panel Operativo ICVNL", "App Móvil (roadmap)", "Asistente Virtual"],
  },
  {
    label: "SERVICIOS",
    color: "#A78BFA",
    items: ["API Gateway", "Microservicios REST/gRPC", "Motor de Predicción (Python/FastAPI)", "Scheduler de Citas"],
  },
  {
    label: "DATOS",
    color: S.warn,
    items: ["Data Lake (GCP BigQuery)", "PostgreSQL Operativo", "Redis Cache", "Apache Kafka (streaming)"],
  },
  {
    label: "INTEGRACIÓN",
    color: S.ok,
    items: ["REPUVE Webservice", "Registro Vehicular NL", "Portal Citas Online", "IoT Ventanillas (Fase 2)"],
  },
];

const phases = [
  {
    num: "01",
    name: "PILOTO",
    duration: "Meses 1–4",
    delegaciones: "2 delegaciones (Monterrey centro, Guadalupe)",
    metas: [
      "Validar precisión del modelo con datos reales",
      "Integrar sistema de colas existente",
      "KPIs baseline documentados",
      "Capacitación del equipo operativo",
    ],
    status: "active",
  },
  {
    num: "02",
    name: "ZONA METRO",
    duration: "Meses 5–9",
    delegaciones: "9 delegaciones AMM completas",
    metas: [
      "Despliegue completo en área metropolitana",
      "Sistema de citas en producción",
      "Integración con app ciudadana",
      "Reducción 40% tiempo de espera validada",
    ],
    status: "planned",
  },
  {
    num: "03",
    name: "ESTATAL",
    duration: "Meses 10–18",
    delegaciones: "Cobertura total Nuevo León",
    metas: [
      "Expansión a municipios del interior del estado",
      "Integración completa REPUVE y Licencias",
      "Asistente IA en producción",
      "Modelo predictivo estacional calibrado",
    ],
    status: "planned",
  },
];

export default function Propuesta() {
  return (
    <div style={{ minHeight: "100%", paddingBottom: 60 }}>
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 380,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "52px 56px",
        }}
      >
        {/* Photo bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${MTY_BG}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.70) 60%, rgba(9,9,11,0.85) 100%)",
          }}
        />
        {/* Orange accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${S.brand}, ${S.coral})`,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
          <Reveal>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: S.brand,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Propuesta Técnica · Instituto de Control Vehicular de Nuevo León
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 52,
                lineHeight: 1.05,
                color: S.ink,
                letterSpacing: "-0.03em",
                margin: "0 0 16px",
              }}
            >
              Inteligencia Predictiva
              <br />
              <span style={{ color: S.brand }}>para el Control Vehicular</span>
              <br />
              de Nuevo León
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "rgba(242,242,244,0.65)",
                lineHeight: 1.65,
                maxWidth: 560,
                margin: 0,
              }}
            >
              Plataforma de IA que predice demanda de trámites vehiculares con 48 horas
              de anticipación, distribuye carga entre delegaciones automáticamente y reduce
              el tiempo de espera ciudadano en un 40%.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Diagnóstico ── */}
      <section style={{ padding: "44px 56px 0" }}>
        <Reveal>
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: S.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Diagnóstico Actual
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 24,
                color: S.ink,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              El problema que resolvemos
            </h2>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
              marginTop: 20,
            }}
          >
            {diagnostics.map((d) => (
              <div
                key={d.label}
                style={{
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderRadius: 12,
                  padding: "20px 22px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    color: S.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {d.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 28,
                    color: d.color,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {d.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11.5,
                    color: S.muted,
                    marginTop: 6,
                  }}
                >
                  estado actual sin PREDIX-ICV
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── 5 Modules ── */}
      <section style={{ padding: "44px 56px 0" }}>
        <Reveal>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: S.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Solución
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 24,
                color: S.ink,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              5 Módulos Integrados
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {modules.map((m, i) => (
            <Reveal key={m.num} delay={i * 60}>
              <div
                style={{
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderRadius: 12,
                  padding: "24px 28px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 24,
                  alignItems: "start",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                {/* Number + icon */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      fontSize: 32,
                      color: "rgba(255,130,1,0.35)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      minWidth: 42,
                    }}
                  >
                    {m.num}
                  </div>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "rgba(255,130,1,0.1)",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,130,1,0.2)",
                    }}
                  >
                    <m.icon size={18} color={S.brand} />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 17,
                      color: S.ink,
                      letterSpacing: "-0.02em",
                      marginBottom: 8,
                    }}
                  >
                    {m.title}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13.5,
                      color: "oklch(0.22 0.01 50 / 0.65)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {m.desc}
                  </p>
                </div>

                {/* Benefits */}
                <div style={{ minWidth: 220 }}>
                  {m.benefits.map((b) => (
                    <div
                      key={b}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 7,
                        marginBottom: 6,
                      }}
                    >
                      <CheckCircle2
                        size={12}
                        color={S.ok}
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: S.muted,
                          lineHeight: 1.4,
                        }}
                      >
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Architecture ── */}
      <section style={{ padding: "44px 56px 0" }}>
        <Reveal>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: S.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Arquitectura Técnica
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 24,
                color: S.ink,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Stack cloud-native, capas independientes
            </h2>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {archLayers.map((layer) => (
              <div
                key={layer.label}
                style={{
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderTop: `2px solid ${layer.color}`,
                  borderRadius: 12,
                  padding: "18px 18px 20px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    color: layer.color,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                    fontWeight: 600,
                  }}
                >
                  {layer.label}
                </div>
                {layer.items.map((item) => (
                  <div
                    key={item}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "oklch(0.22 0.01 50 / 0.7)",
                      marginBottom: 7,
                      paddingLeft: 10,
                      borderLeft: `2px solid color-mix(in oklch, ${layer.color} 30%, transparent)`,
                      lineHeight: 1.3,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Phases ── */}
      <section style={{ padding: "44px 56px 0" }}>
        <Reveal>
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: S.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Implementación
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 24,
                color: S.ink,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              3 Fases de Despliegue
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {phases.map((phase, i) => (
            <Reveal key={phase.num} delay={i * 80}>
              <div
                style={{
                  background: S.surface,
                  border: `1px solid ${phase.status === "active" ? "rgba(255,130,1,0.35)" : S.border}`,
                  borderRadius: 14,
                  padding: "24px 24px 28px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow:
                    phase.status === "active"
                      ? "0 4px 24px rgba(255,130,1,0.18)"
                      : "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                {phase.status === "active" && (
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      color: S.brand,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      background: "rgba(255,130,1,0.12)",
                      border: "1px solid rgba(255,130,1,0.25)",
                      borderRadius: 6,
                      padding: "3px 8px",
                    }}
                  >
                    En curso
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    fontSize: 40,
                    color:
                      phase.status === "active"
                        ? "rgba(255,130,1,0.4)"
                        : "rgba(0,0,0,0.06)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    marginBottom: 10,
                  }}
                >
                  {phase.num}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: phase.status === "active" ? S.brand : S.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {phase.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 15,
                    color: S.ink,
                    letterSpacing: "-0.01em",
                    marginBottom: 4,
                  }}
                >
                  {phase.duration}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: S.muted,
                    marginBottom: 18,
                  }}
                >
                  {phase.delegaciones}
                </div>

                <div
                  style={{
                    height: 1,
                    background: S.border,
                    marginBottom: 14,
                  }}
                />

                {phase.metas.map((m) => (
                  <div
                    key={m}
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <ArrowRight
                      size={11}
                      color={phase.status === "active" ? S.brand : S.muted}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12.5,
                        color: "oklch(0.22 0.01 50 / 0.65)",
                        lineHeight: 1.45,
                      }}
                    >
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
