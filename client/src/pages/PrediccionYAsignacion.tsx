import { Redirect } from "wouter";
import { trpc } from "@/lib/trpc";
import { hasGroupAccess, MODULE_GROUPS } from "@/lib/moduleGroups";
import { useState } from "react";
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import DelegacionesMap from "@/components/demo/DelegacionesMap";
import { DEMO_PRECISION_MODELO } from "@/lib/demoData";
import { DatoEjemplo } from "@/components/demo/DemoVisuals";

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

// Distinct from S.coral (brand-destructive-accent): this is the operational
// severity/"saturado" status color used across the semaphore, capacity chart
// and scenario table.
const lvlColor: Record<string, string> = {
  ok: S.ok,
  warn: S.warn,
  crit: "oklch(0.55 0.20 25)",
};

// Local tokens are plain oklch() strings (no alpha channel baked in), so tints
// that used to be built by string-concatenating a hex alpha suffix (e.g.
// `${color}22`) are built here via the CSS oklch alpha syntax instead.
function withAlpha(color: string, alpha: number) {
  return color.replace(/\)$/, ` / ${alpha})`);
}

const TABS = ["Mapa de Ocupación", "Demanda por Trámite", "Capacidad vs Demanda", "Escenarios"];
const [SLUG_PREDICCION, SLUG_ASIGNADOR] = MODULE_GROUPS.prediccion_asignacion;
const TAB_PERMISSION = [SLUG_PREDICCION, SLUG_PREDICCION, SLUG_ASIGNADOR, SLUG_ASIGNADOR];
const activeTabStyle = {
  background: "rgba(255,130,1,0.11)",
  color: S.brand,
  borderColor: "rgba(255,130,1,0.3)",
};
const inactiveTabStyle = {
  background: "transparent",
  color: S.muted,
  borderColor: S.border,
};

const tramites = [
  {
    name: "Refrendo",
    color: S.brand,
    data: [
      { h: "07", v: 12 }, { h: "08", v: 38 }, { h: "09", v: 72 },
      { h: "10", v: 88 }, { h: "11", v: 65 }, { h: "12", v: 43 },
      { h: "13", v: 28 }, { h: "14", v: 35 }, { h: "15", v: 61 },
      { h: "16", v: 79 }, { h: "17", v: 54 }, { h: "18", v: 22 },
    ],
    today: 847,
    meta: 1000,
  },
  {
    name: "Licencias",
    color: "#A78BFA", // categorical series accent, theme-agnostic — left as-is (not part of the surface/text palette)
    data: [
      { h: "07", v: 8 }, { h: "08", v: 22 }, { h: "09", v: 41 },
      { h: "10", v: 53 }, { h: "11", v: 48 }, { h: "12", v: 31 },
      { h: "13", v: 19 }, { h: "14", v: 24 }, { h: "15", v: 39 },
      { h: "16", v: 48 }, { h: "17", v: 37 }, { h: "18", v: 14 },
    ],
    today: 384,
    meta: 500,
  },
  {
    name: "Altas y Bajas",
    color: S.ok,
    data: [
      { h: "07", v: 5 }, { h: "08", v: 14 }, { h: "09", v: 28 },
      { h: "10", v: 36 }, { h: "11", v: 29 }, { h: "12", v: 18 },
      { h: "13", v: 11 }, { h: "14", v: 15 }, { h: "15", v: 24 },
      { h: "16", v: 31 }, { h: "17", v: 22 }, { h: "18", v: 9 },
    ],
    today: 242,
    meta: 350,
  },
  {
    name: "Ponlo a Tu Nombre",
    color: S.warn,
    data: [
      { h: "07", v: 3 }, { h: "08", v: 9 }, { h: "09", v: 18 },
      { h: "10", v: 25 }, { h: "11", v: 21 }, { h: "12", v: 13 },
      { h: "13", v: 8 }, { h: "14", v: 11 }, { h: "15", v: 18 },
      { h: "16", v: 23 }, { h: "17", v: 17 }, { h: "18", v: 7 },
    ],
    today: 174,
    meta: 250,
  },
];

const capacidadData = [
  { h: "07", cap: 80, dem: 28 },
  { h: "08", cap: 140, dem: 112 },
  { h: "09", cap: 140, dem: 159 },
  { h: "10", cap: 140, dem: 172 },
  { h: "11", cap: 140, dem: 143 },
  { h: "12", cap: 120, dem: 104 },
  { h: "13", cap: 100, dem: 68 },
  { h: "14", cap: 120, dem: 88 },
  { h: "15", cap: 140, dem: 135 },
  { h: "16", cap: 140, dem: 163 },
  { h: "17", cap: 140, dem: 148 },
  { h: "18", cap: 100, dem: 87 },
  { h: "19", cap: 60, dem: 39 },
];

const horasSaturadas = capacidadData
  .map((d) => ({ ...d, gap: d.dem - d.cap }))
  .filter((d) => d.gap > 0)
  .sort((a, b) => b.gap - a.gap);

const horaCritica = horasSaturadas[0];

const scenarios = [
  {
    name: "Demanda Normal",
    color: S.ok,
    rows: {
      "Tiempo espera": "12 min",
      "Trámites / hora": "47",
      "Ciudadanos / día": "3,850",
      "Ventanillas activas": "28",
      "Citas cumplidas": "78%",
      "Saturación máx.": "71%",
    },
  },
  {
    name: "Hora Pico",
    color: S.warn,
    rows: {
      "Tiempo espera": "34 min",
      "Trámites / hora": "62",
      "Ciudadanos / día": "5,120",
      "Ventanillas activas": "34",
      "Citas cumplidas": "58%",
      "Saturación máx.": "91%",
    },
  },
  {
    name: "Temporada Alta",
    color: lvlColor.crit,
    rows: {
      "Tiempo espera": "51 min",
      "Trámites / hora": "71",
      "Ciudadanos / día": "6,800",
      "Ventanillas activas": "38",
      "Citas cumplidas": "41%",
      "Saturación máx.": "97%",
    },
  },
];

const rowKeys = Object.keys(scenarios[0].rows);

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9.5,
          color: S.muted,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 18,
          color: S.ink,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

const DenseCard = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      background: S.surface,
      border: `1px solid ${S.border}`,
      borderRadius: 10,
      padding: "16px 18px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      ...style,
    }}
  >
    {children}
  </div>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: S.surface3, border: `1px solid ${S.border}`, borderRadius: 8, padding: "8px 12px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.muted, letterSpacing: "0.06em", marginBottom: 4 }}>{label}h</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function PrediccionYAsignacion() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();
  // El useState de activeTab se llama aquí, antes del guard, en vez de después
  // (como en la plantilla original del brief) — debe ejecutarse incondicionalmente
  // en cada render. Si se llamara después del `if` de abajo, la primera vez que
  // este componente montado pasa de isLoading=true a isLoading=false+sin acceso,
  // React llamaría MENOS hooks en ese render que en el anterior ("Rendered fewer
  // hooks than expected"), violando las Rules of Hooks y tronando en producción
  // para cualquier rol sin acceso — no solo en el test (el mock de trpc en el
  // test nunca simula esa transición loading→loaded, así que no lo habría detectado).
  const [activeTab, setActiveTab] = useState(0);


  const puedePrediccion = isLoading || (accessibleModules ?? []).includes(SLUG_PREDICCION);
  const puedeAsignador = isLoading || (accessibleModules ?? []).includes(SLUG_ASIGNADOR);
  const visibleTabIndices = TABS.map((_, i) => i)
    .filter((i) => (TAB_PERMISSION[i] === SLUG_PREDICCION ? puedePrediccion : puedeAsignador));
  const effectiveTab = visibleTabIndices.includes(activeTab) ? activeTab : visibleTabIndices[0] ?? 0;
  if (!isLoading && !hasGroupAccess("prediccion_asignacion", accessibleModules)) return <Redirect to="/" />;

  return (
    <div style={{ minHeight: "100%", paddingBottom: 48 }}>
      {/* Header */}
      <div
        style={{
          padding: "28px 40px 0",
          background: S.surface,
          borderBottom: `1px solid ${S.border}`,
        }}
      >
        <div style={{ marginBottom: 4 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9.5,
              color: S.brand,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Módulo Operativo
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: S.ink,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
            }}
          >
            Predicción & Asignación
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                fontWeight: 600,
                color: S.ok,
                background: "oklch(0.62 0.14 145 / 0.12)",
                border: "1px solid oklch(0.62 0.14 145 / 0.3)",
                borderRadius: 999,
                padding: "4px 10px",
                letterSpacing: "0.04em",
              }}
            >
              Confianza del modelo: {DEMO_PRECISION_MODELO}%
            </span>
            <DatoEjemplo />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {TABS.map((tab, i) => (
            visibleTabIndices.includes(i) ? (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12.5,
                  fontWeight: i === effectiveTab ? 600 : 400,
                  padding: "8px 16px",
                  borderRadius: "8px 8px 0 0",
                  border: `1px solid`,
                  borderBottom: "none",
                  cursor: "pointer",
                  transition: "all 140ms",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  ...(i === effectiveTab ? activeTabStyle : inactiveTabStyle),
                }}
              >
                {tab}
              </button>
            ) : null
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 40px" }}>
        {/* Tab 0: Mapa */}
        {effectiveTab === 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, alignItems: "start" }}>
            <DenseCard>
              <SectionHeader label="AMM · Área Metro" title="Ocupación por Delegación" />
              <DelegacionesMap />
            </DenseCard>

            <DenseCard>
              <SectionHeader label="Predicción 48h" title="Demanda Proyectada Mañana" />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { del: "Monterrey", mañana: "Saturado", pct: 94, ciudadanos: 2520 },
                  { del: "Guadalupe", mañana: "Saturado", pct: 88, ciudadanos: 1830 },
                  { del: "San Nicolás", mañana: "Moderado", pct: 74, ciudadanos: 1140 },
                  { del: "Apodaca", mañana: "Moderado", pct: 68, ciudadanos: 970 },
                  { del: "Sta. Catarina", mañana: "Moderado", pct: 62, ciudadanos: 780 },
                  { del: "Escobedo", mañana: "Fluido", pct: 48, ciudadanos: 560 },
                  { del: "García", mañana: "Fluido", pct: 39, ciudadanos: 320 },
                  { del: "San Pedro GG", mañana: "Fluido", pct: 35, ciudadanos: 290 },
                  { del: "Juárez", mañana: "Fluido", pct: 28, ciudadanos: 180 },
                ].map((r) => {
                  const col = r.pct >= 80 ? lvlColor.crit : r.pct >= 55 ? S.warn : S.ok;
                  return (
                    <div key={r.del} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: S.ink, width: 120, flexShrink: 0 }}>{r.del}</div>
                      <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${r.pct}%`, background: col, borderRadius: 3 }} />
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: col, fontWeight: 600, width: 36, textAlign: "right" }}>
                        {r.pct}%
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: S.muted, width: 60, textAlign: "right" }}>
                        {r.ciudadanos.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </DenseCard>
          </div>
        )}

        {/* Tab 1: Trámites */}
        {effectiveTab === 1 && (
          <div>
            <SectionHeader label="Desglose" title="Demanda por Tipo de Trámite" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {tramites.map((t, i) => (
                <DenseCard key={t.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: 14,
                          color: S.ink,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {t.name}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.muted, letterSpacing: "0.06em", marginTop: 3 }}>
                        Demanda horaria · hoy
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 20, color: t.color, letterSpacing: "-0.02em" }}>
                        {t.today.toLocaleString()}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: S.muted }}>
                        / {t.meta.toLocaleString()} meta
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 4, background: "rgba(0,0,0,0.05)", borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(t.today / t.meta) * 100}%`, background: t.color, borderRadius: 2 }} />
                  </div>

                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={t.data} margin={{ top: 2, right: 2, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`g-tramite-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={t.color} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={t.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="h" tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, fill: S.muted }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Area type="monotone" dataKey="v" stroke={t.color} strokeWidth={1.5} fill={`url(#g-tramite-${i})`} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </DenseCard>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Capacidad */}
        {effectiveTab === 2 && (
          <div>
            <SectionHeader label="Análisis Operativo" title="Capacidad Instalada vs. Demanda Horaria" />
            <DenseCard>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: S.muted }}>
                  Las barras grises muestran la capacidad máxima de atención. La línea naranja es la demanda.
                  Donde la línea supera las barras, el sistema está saturado.
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={capacidadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" />
                  <XAxis dataKey="h" tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, fill: S.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, fill: S.muted }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                  <Bar dataKey="cap" name="Capacidad" fill={S.border} radius={[3, 3, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="dem"
                    name="Demanda"
                    stroke={S.brand}
                    strokeWidth={2.5}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      const isOver = payload.dem > payload.cap;
                      return <circle key={`dot-${payload.h}`} cx={cx} cy={cy} r={isOver ? 5 : 3} fill={isOver ? lvlColor.crit : S.brand} stroke="none" />;
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>

              <div style={{ display: "flex", gap: 20, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${S.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 10, background: S.border, borderRadius: 2 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: S.muted }}>Capacidad instalada</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 2, background: S.brand, borderRadius: 1 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: S.muted }}>Demanda real</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: lvlColor.crit }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: lvlColor.crit }}>Saturación activa</span>
                </div>
              </div>
            </DenseCard>

            {horasSaturadas.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 20,
                  marginTop: 20,
                }}
              >
                <DenseCard>
                  <SectionHeader label="Factores" title="Factores Explicativos" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {horasSaturadas.map((h) => (
                      <div
                        key={h.h}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontFamily: "var(--font-body)",
                          fontSize: 12.5,
                          color: S.ink,
                        }}
                      >
                        <span>{h.h}:00 h</span>
                        <span style={{ fontFamily: "var(--font-mono)", color: lvlColor.crit, fontWeight: 600 }}>
                          +{h.gap} sobre capacidad
                        </span>
                      </div>
                    ))}
                  </div>
                </DenseCard>

                <DenseCard style={{ background: S.ink }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9.5,
                      color: S.warn,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Recomendación
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: S.surface, lineHeight: 1.4 }}>
                    Reforzar capacidad entre las {horaCritica.h}:00 y las{" "}
                    {String(Number(horaCritica.h) + 1).padStart(2, "0")}:00 h — la demanda supera la capacidad
                    instalada en {horaCritica.gap} trámites/hora ({Math.round((horaCritica.gap / horaCritica.cap) * 100)}%).
                  </div>
                </DenseCard>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Scenarios */}
        {effectiveTab === 3 && (
          <div>
            <SectionHeader label="Análisis Comparativo" title="3 Escenarios de Carga" />
            <DenseCard>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9.5,
                        color: S.muted,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textAlign: "left",
                        padding: "10px 14px",
                        borderBottom: `1px solid ${S.border}`,
                        fontWeight: 400,
                      }}>
                        INDICADOR
                      </th>
                      {scenarios.map((sc) => (
                        <th
                          key={sc.name}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: sc.color,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            textAlign: "center",
                            padding: "10px 14px",
                            borderBottom: `1px solid ${S.border}`,
                            fontWeight: 600,
                            background: withAlpha(sc.color, 0.03),
                          }}
                        >
                          {sc.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rowKeys.map((key, ri) => (
                      <tr
                        key={key}
                        style={{ background: ri % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}
                      >
                        <td
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12.5,
                            color: S.ink,
                            padding: "11px 14px",
                            borderBottom: `1px solid ${S.border}`,
                          }}
                        >
                          {key}
                        </td>
                        {scenarios.map((sc) => (
                          <td
                            key={sc.name}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 13,
                              fontWeight: 600,
                              color: sc.color,
                              textAlign: "center",
                              padding: "11px 14px",
                              borderBottom: `1px solid ${S.border}`,
                              background: withAlpha(sc.color, 0.02),
                            }}
                          >
                            {(sc.rows as Record<string, string>)[key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DenseCard>
          </div>
        )}
      </div>
    </div>
  );
}
