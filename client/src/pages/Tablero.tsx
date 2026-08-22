import { useEffect, useRef, useState, ReactNode } from "react";
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
  Download,
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

/* alpha helper — lvlColor/S values are oklch() strings now, so the old
   hex "+ alpha suffix" concatenation trick (`${color}1A`) no longer
   produces valid CSS. Insert an oklch alpha channel instead. */
function withAlpha(oklch: string, alpha: number) {
  return oklch.replace(/\)$/, ` / ${alpha})`);
}

const municipios = [
  { id: "garcia", name: "García", lvl: "ok", pct: 41, queue: 312 },
  { id: "stacatarina", name: "Sta. Catarina", lvl: "warn", pct: 67, queue: 821 },
  { id: "sanpedro", name: "San Pedro GG", lvl: "ok", pct: 38, queue: 284 },
  { id: "escobedo", name: "Escobedo", lvl: "warn", pct: 72, queue: 934 },
  { id: "monterrey", name: "Monterrey", lvl: "crit", pct: 91, queue: 2_341 },
  { id: "sannicolas", name: "San Nicolás", lvl: "warn", pct: 69, queue: 1_102 },
  { id: "apodaca", name: "Apodaca", lvl: "warn", pct: 63, queue: 801 },
  { id: "guadalupe", name: "Guadalupe", lvl: "crit", pct: 84, queue: 1_654 },
  { id: "juarez", name: "Juárez", lvl: "ok", pct: 33, queue: 221 },
];

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
  { name: "Sistema de Colas ICVNL", type: "Cola", status: "live" },
  { name: "Registro Vehicular NL", type: "Base de datos", status: "live" },
  { name: "Portal de Citas Online", type: "API REST", status: "live" },
  { name: "Módulo REPUVE", type: "Webservice", status: "live" },
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

function MunicipioCard({ m, hovered, onHover }: {
  m: typeof municipios[0];
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  const color = lvlColor[m.lvl];
  const isHovered = hovered === m.id;

  return (
    <div
      onMouseEnter={() => onHover(m.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        background: isHovered
          ? withAlpha(color, 0.10)
          : withAlpha(color, 0.06),
        border: `1px solid ${withAlpha(color, isHovered ? 0.33 : 0.16)}`,
        borderRadius: 10,
        padding: "12px 14px",
        cursor: "default",
        transition: "all 160ms",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9.5,
          color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {m.pct}% ocup.
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 12.5,
          color: S.ink,
          lineHeight: 1.2,
        }}
      >
        {m.name}
      </div>
      {isHovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: S.surface3,
            border: `1px solid ${S.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            zIndex: 20,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: S.muted,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {m.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: 13,
              color,
            }}
          >
            {m.queue.toLocaleString()} ciudadanos en espera
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: S.muted,
              marginTop: 2,
            }}
          >
            Ocupación: {m.pct}% ·{" "}
            {m.lvl === "ok" ? "Fluido" : m.lvl === "warn" ? "Moderado" : "Saturado"}
          </div>
        </div>
      )}
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
          gridTemplateColumns: "1fr 1fr",
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
              <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                {[
                  { label: "Fluido", color: S.ok },
                  { label: "Moderado", color: S.warn },
                  { label: "Saturado", color: S.coral },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color }} />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9.5,
                        color: S.muted,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3x3 grid */}
            <MunicipioGrid />
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
                % ocupación promedio diaria · semana actual
              </div>
            </div>
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
          </div>
        </Reveal>
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
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: S.ink,
              }}
            >
              Exporta el estado operativo actual con todos los indicadores
            </div>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 18px",
              background: S.brand,
              border: "none",
              borderRadius: 8,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 13,
              color: "oklch(0.18 0.02 50)",
              cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "opacity 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            onClick={() => alert("Exportando reporte CSV — PREDIX-ICV · " + new Date().toLocaleDateString("es-MX"))}
          >
            <Download size={14} />
            Exportar CSV
          </button>
        </div>
      </section>
    </div>
  );
}

/* ── municipio grid extracted to fix closure issue ── */
function MunicipioGrid() {
  const hovered = useRef<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
      }}
    >
      {municipios.map((m) => (
        <MunicipioCard key={m.id} m={m} hovered={hoveredId} onHover={setHoveredId} />
      ))}
    </div>
  );
}
