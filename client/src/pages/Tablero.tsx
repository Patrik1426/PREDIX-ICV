import { useEffect, useRef, useState, ReactNode } from "react";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  AlertCircle,
  CheckCircle2,
  Circle,
  Database,
  Wifi,
  Clock,
} from "lucide-react";
import DelegacionesMap from "@/components/demo/DelegacionesMap";
import ReportExporter from "@/components/ReportExporter";
import { DatoEjemplo } from "@/components/demo/DemoVisuals";
import { DEMO_DELEGACIONES } from "@/lib/demoData";

/* ── tokens ── */
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

/* ── reveal hook ── */
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

/* ── data ── */
const hourlyDemand = [
  { h: "07", v: 28 }, { h: "08", v: 72 }, { h: "09", v: 128 },
  { h: "10", v: 152 }, { h: "11", v: 138 }, { h: "12", v: 104 },
  { h: "13", v: 68 }, { h: "14", v: 79 }, { h: "15", v: 121 },
  { h: "16", v: 148 }, { h: "17", v: 131 }, { h: "18", v: 87 },
  { h: "19", v: 39 },
];

const weeklyData = [
  { day: "Lun", pct: 61, lvl: "warn" },
  { day: "Mar", pct: 77, lvl: "warn" },
  { day: "Mié", pct: 93, lvl: "crit" },
  { day: "Jue", pct: 44, lvl: "ok" },
  { day: "Vie", pct: 85, lvl: "crit" },
  { day: "Sáb", pct: 28, lvl: "ok" },
  { day: "Hoy", pct: 71, lvl: "warn" },
];

const lvlColor: Record<string, string> = { ok: "oklch(0.62 0.14 145)", warn: "oklch(0.75 0.15 75)", crit: "oklch(0.55 0.20 25)" };

const kpis = [
  {
    label: "TIEMPO DE ESPERA",
    value: "12 min",
    meta: "≤20 min",
    pct: 100,
    status: "ok",
    trend: "down",
    delta: "-3.2 min",
    note: "Por debajo de la meta",
  },
  {
    label: "TRÁMITES / HORA",
    value: "47",
    meta: "55 trám/h",
    pct: 85,
    status: "warn",
    trend: "up",
    delta: "+4",
    note: "85% de la meta",
  },
  {
    label: "CIUDADANOS HOY",
    value: "4,312",
    meta: "5,000 / día",
    pct: 86,
    status: "warn",
    trend: "up",
    delta: "+218",
    note: "86% de la meta",
  },
  {
    label: "CITAS CUMPLIDAS",
    value: "62%",
    meta: "90%",
    pct: 69,
    status: "warn",
    trend: "flat",
    delta: "=",
    note: "Gap 28 pp",
  },
  {
    label: "ALTAS PROCESADAS",
    value: "234",
    meta: "500 / día",
    pct: 47,
    status: "crit",
    trend: "down",
    delta: "-12%",
    note: "Gap >50% ⚠",
  },
  {
    label: "DELEGACIONES",
    value: "8 / 9",
    meta: "9 activas",
    pct: 89,
    status: "warn",
    trend: "flat",
    delta: "—",
    note: "Juárez fuera de servicio",
  },
  {
    label: "TIEMPO ATENCIÓN",
    value: "9 min",
    meta: "≤15 min",
    pct: 100,
    status: "ok",
    trend: "down",
    delta: "-1.4 min",
    note: "Por debajo de la meta",
  },
];

const dataSources = [
  { name: "Sistema de Colas ICVNL", type: "Cola", status: "planned" },
  { name: "Registro Vehicular NL", type: "Base de datos", status: "planned" },
  { name: "Portal de Citas Online", type: "API REST", status: "planned" },
  { name: "Módulo REPUVE", type: "Webservice", status: "planned" },
  { name: "Padrón de Licencias", type: "Base de datos", status: "planned" },
  { name: "Telemetría de Ventanillas", type: "IoT / MQTT", status: "planned" },
];

/* ── sub-components ── */
function KpiCard({ kpi }: { kpi: typeof kpis[0] }) {
  const color =
    kpi.status === "ok" ? S.ok : kpi.status === "warn" ? S.warn : S.coral;
  const TrendIcon =
    kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;

  return (
    <div
      style={{
        background: S.surface,
        border: `1px solid ${S.border}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: `0 2px 8px rgba(0,0,0,0.08)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            color: S.muted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {kpi.label}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: kpi.trend === "up" ? S.ok : kpi.trend === "down" ? S.coral : S.muted,
          }}
        >
          <TrendIcon size={10} />
          {kpi.delta}
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 26,
          color: color,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {kpi.value}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            color: S.muted,
            letterSpacing: "0.04em",
          }}
        >
          META: {kpi.meta}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            color: color,
          }}
        >
          {kpi.pct}%
        </span>
      </div>

      {/* progress bar */}
      <div
        style={{
          height: 3,
          background: "rgba(0,0,0,0.06)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(kpi.pct, 100)}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.6s ease",
          }}
        />
      </div>

      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: S.muted,
        }}
      >
        {kpi.note}
      </span>
    </div>
  );
}

const CustomBarShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  const color = lvlColor[payload.lvl] ?? S.brand;
  return (
    <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.75} rx={3} />
  );
};

const CustomBarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: S.surface3,
        border: `1px solid ${S.border}`,
        borderRadius: 8,
        padding: "8px 12px",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: S.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {d.day}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 18, color: lvlColor[d.lvl] }}>
        {d.pct}%
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: S.muted }}>
        Ocupación promedio
      </div>
    </div>
  );
};

/* ── page ── */
export default function Tablero() {
  const hoveredRef = useRef<string | null>(null);
  const [period, setPeriod] = useState<"semana" | "promedio">("semana");
  const [delegacionFiltro, setDelegacionFiltro] = useState<string>("todas");

  const delegacionPrioritaria = [...DEMO_DELEGACIONES].sort((a, b) => b.ocupacion - a.ocupacion)[0];

  const weeklyAverage = Math.round(
    weeklyData.reduce((sum, d) => sum + d.pct, 0) / weeklyData.length
  );

  return (
    <div style={{ minHeight: "100%", paddingBottom: 48 }}>
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: S.surface,
          borderBottom: `1px solid ${S.border}`,
          padding: "52px 48px 40px",
        }}
      >
        {/* Demand curve ambient background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            pointerEvents: "none",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyDemand} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#FF8201" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FF8201" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#FF8201"
                strokeWidth={2}
                fill="url(#demandGrad)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: S.brand,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            PREDIX-ICV · Sistema Predictivo · ICVNL Nuevo León · AGO 2026
          </div>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 80,
              lineHeight: 0.9,
              color: S.ink,
              letterSpacing: "-0.04em",
            }}
          >
            -40%
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 22,
              color: S.muted,
              marginTop: 10,
              letterSpacing: "-0.02em",
            }}
          >
            en tiempo de espera ciudadano proyectado
          </div>

          <div style={{ display: "flex", gap: 40, marginTop: 32 }}>
            {[
              { label: "PRECISIÓN MODELO", value: "98.3%", color: S.brand, sub: "IA predictiva" },
              { label: "HOY ATENDIDOS", value: "4,312", color: S.ink, sub: "ciudadanos" },
              { label: "ESTADO SISTEMA", value: "OPERATIVO", color: S.ok, sub: "8/9 delegaciones" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    color: S.muted,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    fontSize: 22,
                    color: s.color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: S.muted,
                    marginTop: 2,
                  }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filtros ── */}
      <section style={{ padding: "24px 48px 0" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderRadius: 10,
            padding: "12px 16px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: S.muted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Filtros — tendencia semanal y tabla por delegación
          </span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "semana" | "promedio")}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "7px 10px",
              borderRadius: 8,
              border: `1px solid ${S.border}`,
              background: S.surface2,
              color: S.ink,
              cursor: "pointer",
            }}
          >
            <option value="semana">Diario — semana actual</option>
            <option value="promedio">Promedio del periodo</option>
          </select>
          <select
            value={delegacionFiltro}
            onChange={(e) => setDelegacionFiltro(e.target.value)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "7px 10px",
              borderRadius: 8,
              border: `1px solid ${S.border}`,
              background: S.surface2,
              color: S.ink,
              cursor: "pointer",
            }}
          >
            <option value="todas">Todas las delegaciones</option>
            {DEMO_DELEGACIONES.map((d) => (
              <option key={d.nombre} value={d.nombre}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ── Prioridad del día ── */}
      <section style={{ padding: "24px 48px 0" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: S.ink,
            borderRadius: 16,
            padding: "24px 28px",
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: S.warn,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Prioridad del día
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "rgba(255, 255, 255, 0.5)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 4,
                }}
              >
                Datos de ejemplo
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: S.surface,
                letterSpacing: "-0.02em",
                maxWidth: 520,
              }}
            >
              Amortiguar la demanda en {delegacionPrioritaria.nombre} — {Math.round(delegacionPrioritaria.ocupacion * 100)}% de ocupación actual.
            </div>
          </div>
          <Link
            href="/modulos/prediccion_asignacion"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 13,
              padding: "10px 18px",
              borderRadius: 9,
              background: S.brand,
              color: "oklch(0.18 0.02 50)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Ver recomendación →
          </Link>
        </div>
      </section>

      {/* ── KPIs ── */}
      <section style={{ padding: "32px 48px 0" }}>
        <Reveal>
          <div style={{ marginBottom: 16 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: S.ink,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Indicadores de Éxito
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12.5,
                color: S.muted,
                margin: "4px 0 0",
              }}
            >
              Actualizado hace 2 min · Semana del 18–24 ago 2026
            </p>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Map + Weekly chart ── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          padding: "28px 48px 0",
        }}
      >
        {/* Municipality map */}
        <Reveal>
          <div
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: 12,
              padding: "20px 20px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: S.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                Ocupación por Delegación
              </div>
            </div>

            <DelegacionesMap />
          </div>
        </Reveal>

        {/* Weekly trend */}
        <Reveal delay={80}>
          <div
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: 12,
              padding: "20px 20px 8px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: S.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                Tendencia Semanal — Ocupación
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: S.muted,
                  marginTop: 4,
                }}
              >
                {period === "semana"
                  ? "% ocupación promedio diaria · semana actual"
                  : "% ocupación promedio del periodo · 7 días"}
              </div>
            </div>
            {period === "semana" ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, fill: "oklch(0.48 0.01 50)", letterSpacing: 2 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, fill: "oklch(0.48 0.01 50)" }}
                    axisLine={false}
                    tickLine={false}
                    tickCount={5}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="pct" shape={<CustomBarShape />} radius={[3, 3, 0, 0]}>
                    {weeklyData.map((d) => (
                      <Cell key={d.day} fill={lvlColor[d.lvl]} fillOpacity={0.75} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 48,
                    color: lvlColor[weeklyAverage >= 85 ? "crit" : weeklyAverage >= 65 ? "warn" : "ok"],
                  }}
                >
                  {weeklyAverage}%
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: S.muted, marginTop: 8 }}>
                  Ocupación promedio de la semana ({weeklyData.length} días)
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* ── Alertas + Desempeño por delegación ── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          padding: "28px 48px 0",
        }}
      >
        <div
          data-testid="alertas-priorizadas"
          style={{
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderRadius: 12,
            padding: "20px 20px 22px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                color: S.ink,
                letterSpacing: "-0.01em",
              }}
            >
              Alertas Priorizadas
            </div>
            <DatoEjemplo />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {kpis
              .filter((k) => k.status !== "ok")
              .sort((a, b) => (a.status === "crit" ? -1 : b.status === "crit" ? 1 : 0))
              .map((k) => (
                <div
                  key={k.label}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    borderRadius: 10,
                    border: `1px solid ${S.border}`,
                    padding: "10px 12px",
                  }}
                >
                  <AlertCircle
                    size={15}
                    color={k.status === "crit" ? S.coral : S.warn}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, fontWeight: 600, color: S.ink }}>
                      {k.label}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: S.muted, marginTop: 2 }}>
                      {k.note}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div
          data-testid="delegacion-performance-table"
          style={{
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderRadius: 12,
            padding: "20px 20px 22px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              color: S.ink,
              letterSpacing: "-0.01em",
              marginBottom: 14,
            }}
          >
            Desempeño por Delegación
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {DEMO_DELEGACIONES.filter((d) => delegacionFiltro === "todas" || d.nombre === delegacionFiltro)
              .sort((a, b) => b.ocupacion - a.ocupacion)
              .map((d, i, arr) => (
                <div
                  key={d.nombre}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${S.border}` : "none",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, fontWeight: 500, color: S.ink }}>
                    {d.nombre}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: lvlColor[d.estado === "saturado" ? "crit" : d.estado === "moderado" ? "warn" : "ok"],
                    }}
                  >
                    {Math.round(d.ocupacion * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Data Sources ── */}
      <section style={{ padding: "32px 48px 0" }}>
        <div
          style={{
            borderTop: `1px solid ${S.border}`,
            paddingTop: 24,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: S.muted,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Fuentes de Datos Integradas
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 10,
            }}
          >
            {dataSources.map((ds) => (
              <div
                key={ds.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderRadius: 8,
                }}
              >
                <Database size={13} color={ds.status === "live" ? S.ok : S.muted} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: S.ink,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ds.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9.5,
                      color: S.muted,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {ds.type}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    letterSpacing: "0.08em",
                    color: ds.status === "live" ? S.ok : S.muted,
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {ds.status === "live" ? "Conectado" : "Planeado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reporteador ── */}
      <section style={{ padding: "28px 48px 0" }}>
        <div
          style={{
            borderTop: `1px solid ${S.border}`,
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: S.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Reporteador
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: S.ink }}>
              Exporta el estado operativo actual con todos los indicadores
            </div>
          </div>
          <ReportExporter rows={kpis.map((k) => ({ metrica: k.label, valor: k.value }))} />
        </div>
      </section>
    </div>
  );
}
