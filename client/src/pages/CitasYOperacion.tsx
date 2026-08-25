import { Redirect } from "wouter";
import { trpc } from "@/lib/trpc";
import { hasGroupAccess, MODULE_GROUPS } from "@/lib/moduleGroups";
import { DEMO_DELEGACIONES, DEMO_DEMANDA_HORARIA } from "@/lib/demoData";
import { useEffect, useState } from "react";
import {
  Monitor,
  WifiOff,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  X,
  CheckCircle2,
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

const SCENARIOS = ["Demanda Normal", "Hora Pico", "Temporada Alta"] as const;
type Scenario = typeof SCENARIOS[number];

type Ventanilla = {
  id: string;
  name: string;
  agent: string;
  tramite: string;
  status: "active" | "offline" | "break";
  wait: number;
  atendidos: number;
};

const [SLUG_CITAS, SLUG_MONITOR] = MODULE_GROUPS.citas_operacion;

const scenarioData: Record<Scenario, {
  espera: number;
  atencion: number;
  ocupacion: number;
  citasCumplidas: number;
  enFila: number;
  atendidos: number;
  queueRing: number;
}> = {
  "Demanda Normal": { espera: 12, atencion: 9, ocupacion: 67, citasCumplidas: 78, enFila: 124, atendidos: 4312, queueRing: 67 },
  "Hora Pico": { espera: 34, atencion: 11, ocupacion: 88, citasCumplidas: 58, enFila: 287, atendidos: 2180, queueRing: 88 },
  "Temporada Alta": { espera: 51, atencion: 14, ocupacion: 96, citasCumplidas: 41, enFila: 412, atendidos: 1640, queueRing: 96 },
};

type CitaListItem = {
  hora: string;
  folio: string;
  nombre: string;
  tramite: string;
  del: string;
  status: "pending" | "confirmed";
};

const proximasCitasBase: CitaListItem[] = [
  { hora: "10:20", folio: "ICVNL-2026-84231", nombre: "María González", tramite: "Refrendo", del: "Monterrey Centro", status: "pending" },
  { hora: "10:40", folio: "ICVNL-2026-84232", nombre: "Carlos Herrera", tramite: "Licencias", del: "Guadalupe", status: "confirmed" },
  { hora: "11:00", folio: "ICVNL-2026-84233", nombre: "Ana Martínez", tramite: "Altas y Bajas", del: "Monterrey Centro", status: "confirmed" },
  { hora: "11:20", folio: "ICVNL-2026-84234", nombre: "Pedro Reyes", tramite: "Ponlo a Tu Nombre", del: "Apodaca", status: "pending" },
  { hora: "11:40", folio: "ICVNL-2026-84235", nombre: "Laura Torres", tramite: "Refrendo", del: "San Nicolás", status: "confirmed" },
];

const ventanillasIniciales: Ventanilla[] = [
  { id: "V-01", name: "Ventanilla 01", agent: "L. Martínez", tramite: "Refrendo", status: "active", wait: 8, atendidos: 9 },
  { id: "V-02", name: "Ventanilla 02", agent: "R. Garza", tramite: "Licencias", status: "active", wait: 12, atendidos: 6 },
  { id: "V-03", name: "Ventanilla 03", agent: "A. Torres", tramite: "Refrendo", status: "active", wait: 9, atendidos: 8 },
  { id: "V-04", name: "Ventanilla 04", agent: "M. Reyes", tramite: "Altas y Bajas", status: "active", wait: 7, atendidos: 5 },
  { id: "V-05", name: "Ventanilla 05", agent: "C. López", tramite: "Ponlo a Tu Nombre", status: "active", wait: 15, atendidos: 11 },
  { id: "V-06", name: "Ventanilla 06", agent: "—", tramite: "—", status: "offline", wait: 0, atendidos: 0 },
  { id: "V-07", name: "Ventanilla 07", agent: "F. Núñez", tramite: "Refrendo", status: "active", wait: 11, atendidos: 8 },
  { id: "V-08", name: "Ventanilla 08", agent: "—", tramite: "—", status: "break", wait: 0, atendidos: 0 },
];

function StatusRing({ value, color }: { value: number; color: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <svg width={132} height={132} viewBox="0 0 132 132">
      <circle cx={66} cy={66} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={11} />
      <circle
        cx={66} cy={66} r={r}
        fill="none"
        stroke={color}
        strokeWidth={11}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 66 66)"
        style={{ transition: "stroke-dashoffset 0.7s ease, stroke 0.3s ease" }}
      />
      <text x={66} y={59} textAnchor="middle" fill={color}
        style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 22, fontWeight: 700 }}>
        {value}%
      </text>
      <text x={66} y={76} textAnchor="middle" fill={S.muted}
        style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, letterSpacing: 1 }}>
        OCUPACIÓN
      </text>
    </svg>
  );
}

function VentanillaCard({ v, onToggle }: { v: Ventanilla; onToggle: () => void }) {
  const isActive = v.status === "active";
  const isOffline = v.status === "offline";
  const borderColor = isActive ? "oklch(0.62 0.14 145 / 0.25)" : isOffline ? "oklch(0.58 0.20 28 / 0.2)" : S.border;
  const dotColor = isActive ? S.ok : isOffline ? S.coral : S.warn;
  const dotLabel = isActive ? "Activa" : isOffline ? "Fuera de servicio" : "Descanso";

  return (
    <div
      style={{
        background: S.surface,
        border: `1px solid ${borderColor}`,
        borderRadius: 9,
        padding: "13px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        opacity: isOffline ? 0.6 : 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isActive ? (
            <Monitor size={13} color={S.ok} />
          ) : (
            <WifiOff size={13} color={isOffline ? S.coral : S.warn} />
          )}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: S.ink, letterSpacing: "0.04em" }}>
            {v.id}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8.5,
            color: dotColor,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor, display: "inline-block", animation: isActive ? "pulse 2s infinite" : "none" }} />
          {dotLabel}
        </span>
      </div>

      {isActive && (
        <>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: S.ink, fontWeight: 500 }}>{v.agent}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.muted, letterSpacing: "0.04em", marginTop: 2 }}>{v.tramite}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: S.muted }}>ESPERA</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 600,
                color: v.wait > 12 ? S.warn : S.ok,
              }}
            >
              {v.wait} min
            </span>
          </div>
        </>
      )}

      {(isActive || isOffline) && (
        <button
          onClick={onToggle}
          style={{
            marginTop: 4,
            padding: "6px 0",
            background: "transparent",
            border: `1px solid ${S.border}`,
            borderRadius: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            color: S.muted,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          {isActive ? "Marcar fuera de servicio" : "Reactivar"}
        </button>
      )}
    </div>
  );
}

function DenseKpi({ label, value, color, trend, sub }: {
  label: string; value: string; color: string; trend?: "up" | "down" | "flat"; sub?: string;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <div
      style={{
        background: S.surface,
        border: `1px solid ${S.border}`,
        borderLeft: `2.5px solid ${color}`,
        borderRadius: 9,
        padding: "12px 14px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: S.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: S.muted, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

function AppointmentDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: (cita: CitaListItem) => void }) {
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [form, setForm] = useState({ nombre: "", tramite: "Refrendo", delegacion: "Monterrey Centro", fecha: "" });
  const [folio] = useState(() => `ICVNL-2026-${Math.floor(Math.random() * 90000 + 10000)}`);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: S.surface2,
          border: `1px solid ${S.border}`,
          borderRadius: 16,
          width: 480,
          padding: "28px 32px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.brand, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
              PREDIX-ICV
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: S.ink, letterSpacing: "-0.02em", margin: 0 }}>
              Agendar Cita de Prueba
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: S.muted, padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {step === "form" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Nombre completo", key: "nombre", type: "text", placeholder: "Ej. Juan García Martínez" },
                { label: "Fecha preferida", key: "fecha", type: "date", placeholder: "" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.muted, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={{
                      width: "100%",
                      background: S.surface3,
                      border: `1px solid ${S.border}`,
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: S.ink,
                      outline: "none",
                    }}
                  />
                </div>
              ))}

              {[
                { label: "Tipo de trámite", key: "tramite", opts: ["Refrendo", "Licencias", "Altas y Bajas", "Ponlo a Tu Nombre"] },
                { label: "Delegación", key: "delegacion", opts: ["Monterrey Centro", "Guadalupe", "San Nicolás", "Apodaca", "Escobedo", "Santa Catarina", "San Pedro GG", "García"] },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.muted, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <select
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={{
                      width: "100%",
                      background: S.surface3,
                      border: `1px solid ${S.border}`,
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: S.ink,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {f.opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep("confirm")}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "11px 0",
                background: S.brand,
                border: "none",
                borderRadius: 9,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 13.5,
                color: "oklch(0.18 0.02 50)",
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              Revisar cita →
            </button>
          </>
        )}

        {step === "confirm" && (
          <>
            <div style={{ background: S.surface3, border: `1px solid ${S.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
              {[
                { l: "Nombre", v: form.nombre || "Juan García Martínez" },
                { l: "Trámite", v: form.tramite },
                { l: "Delegación", v: form.delegacion },
                { l: "Fecha", v: form.fecha || "2026-09-03" },
                { l: "Hora asignada", v: "10:20 AM (predicción baja demanda)" },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: S.muted, letterSpacing: "0.06em" }}>{l}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: S.ink, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep("form")} style={{ flex: 1, padding: "11px 0", background: "transparent", border: `1px solid ${S.border}`, borderRadius: 9, fontFamily: "var(--font-body)", fontSize: 13, color: S.muted, cursor: "pointer" }}>
                ← Editar
              </button>
              <button
                onClick={() => {
                  onConfirm({ hora: "10:20", folio, nombre: form.nombre || "Juan García Martínez", tramite: form.tramite, del: form.delegacion, status: "confirmed" });
                  setStep("done");
                }}
                style={{ flex: 2, padding: "11px 0", background: S.brand, border: "none", borderRadius: 9, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, color: "oklch(0.18 0.02 50)", cursor: "pointer" }}
              >
                Confirmar cita
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ marginBottom: 14 }}>
              <CheckCircle2 size={44} color={S.ok} style={{ margin: "0 auto" }} />
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: S.ink, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Cita confirmada
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: S.muted, lineHeight: 1.6, marginBottom: 20 }}>
              Tu cita fue registrada para el 3 sep 2026 a las 10:20 AM en {form.delegacion}.
              <br />Simulación de demostración — no se guarda ni se envía ningún SMS.
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: S.brand, letterSpacing: "0.06em" }}>
              FOLIO: {folio}
            </div>
            <button onClick={onClose} style={{ marginTop: 20, width: "100%", padding: "11px 0", background: S.surface3, border: `1px solid ${S.border}`, borderRadius: 9, fontFamily: "var(--font-body)", fontSize: 13, color: S.ink, cursor: "pointer" }}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CitasYOperacion() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();
  // Los hooks de estado/efecto se llaman aquí, antes del guard, en vez
  // de después (como en la plantilla original del brief) — deben ejecutarse
  // incondicionalmente en cada render. Si se llamaran después del `if` de
  // abajo, la primera vez que este componente montado pasa de
  // isLoading=true a isLoading=false+sin acceso, React llamaría MENOS hooks
  // en ese render que en el anterior ("Rendered fewer hooks than expected"),
  // violando las Rules of Hooks y tronando en producción para cualquier rol
  // sin acceso — no solo en el test (el mock de trpc en el test nunca
  // simula esa transición loading→loaded, así que no lo habría detectado).
  const [scenario, setScenario] = useState<Scenario>("Demanda Normal");
  const [showDialog, setShowDialog] = useState(false);
  const [ventanillas, setVentanillas] = useState<Ventanilla[]>(() => ventanillasIniciales.map((v) => ({ ...v })));
  const [tick, setTick] = useState(0);
  const [citasSimuladas, setCitasSimuladas] = useState<CitaListItem[]>([]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (tick === 0 || tick % 3 !== 0) return;
    setVentanillas((vs) => {
      const activos = vs.reduce<number[]>((acc, v, i) => (v.status === "active" ? [...acc, i] : acc), []);
      if (activos.length === 0) return vs;
      const turno = activos[(tick / 3 - 1) % activos.length];
      return vs.map((v, i) => (i === turno ? { ...v, atendidos: v.atendidos + 1 } : v));
    });
  }, [tick]);

  const toggleVentanilla = (id: string) =>
    setVentanillas((vs) => vs.map((v) => (v.id === id ? { ...v, status: v.status === "active" ? "offline" : "active" } : v)));

  const modules = accessibleModules ?? [];
  const puedeCitas = isLoading || modules.includes(SLUG_CITAS);
  const puedeMonitor = isLoading || modules.includes(SLUG_MONITOR);

  if (!isLoading && !hasGroupAccess("citas_operacion", accessibleModules)) return <Redirect to="/" />;

  const d = scenarioData[scenario];
  const ringColor = d.queueRing >= 90 ? S.coral : d.queueRing >= 70 ? S.warn : S.ok;
  const tramitesHoraVivo = ventanillas.filter((v) => v.status === "active").reduce((sum, v) => sum + v.atendidos, 0);

  const kpis = [
    { label: "TIEMPO ESPERA", value: `${d.espera} min`, color: d.espera > 20 ? S.coral : S.ok, perm: SLUG_MONITOR },
    { label: "TIEMPO ATENCIÓN", value: `${d.atencion} min`, color: S.ink, perm: SLUG_MONITOR },
    { label: "TRÁMITES / HORA", value: `${tramitesHoraVivo}`, color: S.brand, perm: SLUG_MONITOR },
    { label: "OCUPACIÓN", value: `${d.ocupacion}%`, color: ringColor, perm: SLUG_MONITOR },
    { label: "CITAS CUMPLIDAS", value: `${d.citasCumplidas}%`, color: d.citasCumplidas < 60 ? S.coral : S.warn, perm: SLUG_CITAS },
    { label: "ATENDIDOS HOY", value: d.atendidos.toLocaleString(), color: S.ink, perm: SLUG_MONITOR },
  ];
  const visibleKpis = kpis.filter((k) => (k.perm === SLUG_CITAS ? puedeCitas : puedeMonitor));

  return (
    <>
      {showDialog && (
        <AppointmentDialog
          onClose={() => setShowDialog(false)}
          onConfirm={(cita) => setCitasSimuladas((cs) => [cita, ...cs])}
        />
      )}

      <div style={{ minHeight: "100%", paddingBottom: 48 }}>
        {/* Header */}
        <div
          style={{
            padding: "28px 40px 20px",
            background: S.surface,
            borderBottom: `1px solid ${S.border}`,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.brand, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
              Módulo Operativo
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: S.ink, letterSpacing: "-0.02em", margin: 0 }}>
              Citas & Operación
            </h1>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.muted, letterSpacing: "0.08em", marginRight: 4 }}>ESCENARIO</span>
            {SCENARIOS.map((sc) => (
              <button
                key={sc}
                onClick={() => setScenario(sc)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: sc === scenario ? 600 : 400,
                  padding: "7px 14px",
                  border: "1px solid",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 150ms",
                  letterSpacing: "-0.01em",
                  background: sc === scenario ? (sc === "Hora Pico" ? "oklch(0.75 0.15 75 / 0.12)" : sc === "Temporada Alta" ? "oklch(0.58 0.20 28 / 0.12)" : "oklch(0.62 0.14 145 / 0.1)") : "transparent",
                  color: sc === scenario ? (sc === "Hora Pico" ? S.warn : sc === "Temporada Alta" ? S.coral : S.ok) : S.muted,
                  borderColor: sc === scenario ? (sc === "Hora Pico" ? "oklch(0.75 0.15 75 / 0.3)" : sc === "Temporada Alta" ? "oklch(0.58 0.20 28 / 0.3)" : "oklch(0.62 0.14 145 / 0.25)") : S.border,
                }}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* KPI grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
            {visibleKpis.map((k) => (
              <DenseKpi key={k.label} label={k.label} value={k.value} color={k.color} />
            ))}
          </div>

          {/* Status ring + ventanillas */}
          <div style={{ display: "grid", gridTemplateColumns: puedeMonitor ? "repeat(auto-fit, minmax(240px, 1fr))" : "1fr", gap: 20 }}>
            {/* Ring */}
            <div
              style={{
                background: S.surface,
                border: `1px solid ${S.border}`,
                borderRadius: 12,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {puedeMonitor && (
                <>
                  <StatusRing value={d.queueRing} color={ringColor} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: ringColor, letterSpacing: "-0.03em", lineHeight: 1 }}>
                      {d.enFila}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: S.muted, marginTop: 4 }}>
                      ciudadanos en fila activa
                    </div>
                  </div>
                </>
              )}
              {puedeCitas && (
                <button
                  onClick={() => setShowDialog(true)}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    background: S.brand,
                    border: "none",
                    borderRadius: 8,
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 12.5,
                    color: "oklch(0.18 0.02 50)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <Calendar size={13} />
                  Agendar cita
                </button>
              )}
            </div>

            {/* Ventanillas */}
            {puedeMonitor && (
              <div
                style={{
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderRadius: 12,
                  padding: "18px 18px 20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: S.ink, letterSpacing: "-0.01em" }}>
                    Estado de Ventanillas
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[["Activa", S.ok], ["Descanso", S.warn], ["Fuera", S.coral]].map(([l, c]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: S.muted, letterSpacing: "0.06em" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                  {ventanillas.map((v) => <VentanillaCard key={v.id} v={v} onToggle={() => toggleVentanilla(v.id)} />)}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming appointments */}
          {puedeCitas && (
            <div
              style={{
                background: S.surface,
                border: `1px solid ${S.border}`,
                borderRadius: 12,
                padding: "18px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: S.ink, letterSpacing: "-0.01em" }}>
                  Próximas Citas — Hoy
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.muted, letterSpacing: "0.06em" }}>21 AGO 2026</span>
              </div>
              <div style={{ overflowX: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 620 }}>
                {[...citasSimuladas, ...proximasCitasBase].map((apt, i, arr) => (
                  <div
                    key={apt.folio}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 140px 1fr 160px 100px 80px",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: i < arr.length - 1 ? `1px solid ${S.border}` : "none",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: S.brand }}>{apt.hora}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: S.muted, letterSpacing: "0.03em" }}>{apt.folio}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: S.ink, fontWeight: 500 }}>{apt.nombre}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: S.muted }}>{apt.tramite}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: S.muted }}>{apt.del}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9.5,
                        color: apt.status === "confirmed" ? S.ok : S.warn,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {apt.status === "confirmed" ? "Confirmada" : "Pendiente"}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}

          {/* Estado por delegación + demanda por hora */}
          {puedeMonitor && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <div
                data-testid="delegacion-status-table"
                style={{
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                  Estado por Delegación
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {DEMO_DELEGACIONES.map((d, i, arr) => (
                    <div
                      key={d.nombre}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: i < arr.length - 1 ? `1px solid ${S.border}` : "none",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: S.ink }}>{d.nombre}</span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          fontWeight: 600,
                          color: d.estado === "saturado" ? S.coral : d.estado === "moderado" ? S.warn : S.ok,
                        }}
                      >
                        {Math.round(d.ocupacion * 100)}% · {d.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                  Demanda por Hora
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {DEMO_DEMANDA_HORARIA.map((v, i) => {
                    const ratio = v / Math.max(...DEMO_DEMANDA_HORARIA);
                    const color = ratio > 0.75 ? S.coral : ratio > 0.4 ? S.warn : S.ok;
                    return (
                      <div
                        key={i}
                        title={`${i}:00 h — ${v} trámites`}
                        style={{ flex: 1, height: 36, borderRadius: 4, background: color, opacity: 0.35 + ratio * 0.65 }}
                      />
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: S.muted }}>0h</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: S.muted }}>12h</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: S.muted }}>23h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
