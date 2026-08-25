// ============================================================
// Tablero — reemplazo total con el diseño de predix-icvnl (Home.tsx),
// recoloreado a los tokens ICVNL. Ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// Los filtros de periodo/delegación son exactamente tan funcionales como
// en predix-icvnl: el de delegación acota la tabla de desempeño de verdad
// (client-side); el de periodo solo cambia la etiqueta mostrada, igual
// que en la fuente (su propio backend tampoco filtraba por periodo).
// ============================================================

import { PageHeader } from "@/components/predix/PageHeader";
import { MetricCard } from "@/components/predix/MetricCard";
import { DemoNotice } from "@/components/predix/DemoNotice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReportExporter from "@/components/ReportExporter";
import { dashboardData } from "@/lib/predixDemoData";
import { ArrowRight, BellRing, ChevronRight, CircleAlert, Filter, LineChart, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Period = "30d" | "90d" | "ytd";
type Delegation = "todas" | "Pabellón Ciudadano" | "Guadalupe" | "San Nicolás" | "Apodaca";

const statusStyle = (status: string) => (status === "Atención" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success");
const alertStyle = (severity: string) =>
  severity === "high" ? "bg-destructive/10 text-destructive" : severity === "medium" ? "bg-chart-2/10 text-chart-2" : "bg-success/10 text-success";

export default function Tablero() {
  const [period, setPeriod] = useState<Period>("30d");
  const [delegation, setDelegation] = useState<Delegation>("todas");
  const data = dashboardData;

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader
        eyebrow="Tablero de dirección general"
        title="Decidir con anticipación, operar con precisión"
        description="Lectura integrada de recaudo, demanda, servicio y riesgos operativos para conducir la transformación del Instituto de Control Vehicular de Nuevo León."
        action={<ReportExporter rows={data.metrics.map((m) => ({ metrica: m.label, valor: m.value }))} />}
      />
      <DemoNotice text={data.notice} />

      <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Filter className="h-4 w-4" /></span>
          <span>Filtros de análisis</span>
        </div>
        <div className="grid gap-2 sm:flex">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <span className="sr-only">Periodo</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="mt-1 h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-bold normal-case tracking-normal text-foreground outline-none focus:border-primary">
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="ytd">Acumulado anual</option>
            </select>
          </label>
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <span className="sr-only">Delegación</span>
            <select value={delegation} onChange={(e) => setDelegation(e.target.value as Delegation)} className="mt-1 h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-bold normal-case tracking-normal text-foreground outline-none focus:border-primary">
              <option value="todas">Todas las delegaciones</option>
              <option value="Guadalupe">Guadalupe</option>
              <option value="Pabellón Ciudadano">Pabellón Ciudadano</option>
              <option value="San Nicolás">San Nicolás</option>
              <option value="Apodaca">Apodaca</option>
            </select>
          </label>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[1.55rem] bg-foreground px-5 py-6 text-background shadow-[var(--shadow-lg)] sm:px-7">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5" />PRIORIDAD ESTRATÉGICA DEL DÍA</div>
            <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-[-0.05em] sm:text-3xl">Amortiguar el pico en Guadalupe antes de las 11:00 h.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-background/70">La señal predictiva sugiere una reasignación temporal de capacidad y canalización de citas flexibles para preservar el nivel de servicio.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Badge className="rounded-full bg-background/10 px-3 py-1.5 text-xs font-bold text-background hover:bg-background/10"><ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-primary" />Riesgo controlable</Badge>
            <Button className="rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary/90">Ver recomendación <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </section>

      {/* Conteos que siempre parten en filas parejas (1 / 2+2+2 / 3+3 / 6) —
          con 6 columnas por debajo de 1536px las tarjetas quedaban demasiado
          angostas para su propio valor. */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {data.metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <section className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Recaudación y proyección</h2></div>
              <p className="mt-1 text-sm text-muted-foreground">Comportamiento mensual del ingreso, en millones de pesos.</p>
            </div>
            <span className="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">{period === "30d" ? "Últimos 30 días" : period === "90d" ? "Últimos 90 días" : "Acumulado anual"}</span>
          </div>
          <div className="mt-5 h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueTrend} margin={{ top: 10, right: 4, left: -17, bottom: 0 }}>
                <defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.01} /></linearGradient></defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid var(--color-border)", boxShadow: "var(--shadow-popover)" }} />
                <Area type="monotone" dataKey="actual" name="Recaudación" stroke="var(--color-primary)" strokeWidth={3} fill="url(#revenueFill)" />
                <Area type="monotone" dataKey="forecast" name="Proyección" stroke="var(--color-muted-foreground)" strokeWidth={2} fill="transparent" strokeDasharray="5 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Demanda por trámite</h2></div>
          <p className="mt-1 text-sm text-muted-foreground">Distribución acumulada del periodo.</p>
          <div className="mt-5 h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.demandMix} layout="vertical" margin={{ top: 0, right: 12, left: 15, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 600 }} width={88} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Bar dataKey="value" name="Participación" radius={[0, 7, 7, 0]}>
                  {data.demandMix.map((entry) => <Cell key={entry.type} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
            <span>Mayor presión: Refrendo</span>
            <span className="text-primary">42% del volumen</span>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <section className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><BellRing className="h-4 w-4 shrink-0 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Alertas priorizadas</h2></div>
            <button className="text-xs font-bold text-primary">Ver todas</button>
          </div>
          <div className="mt-4 space-y-2.5">
            {data.alerts.map((alert) => (
              <article key={alert.title} className="rounded-xl border border-border p-3.5">
                <div className="flex gap-3">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${alertStyle(alert.severity)}`}><CircleAlert className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-foreground">{alert.title}</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{alert.detail}</p>
                    <p className="mt-2 text-xs font-bold text-primary">{alert.action}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Desempeño por delegación</h2>
              <p className="mt-1 text-sm text-muted-foreground">Lectura comparativa de carga y nivel de servicio.</p>
            </div>
            <button className="flex shrink-0 items-center whitespace-nowrap text-xs font-bold text-primary">Ver operación <ChevronRight className="ml-1 h-3.5 w-3.5" /></button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[640px] w-full text-left">
              <thead>
                <tr className="border-b border-border text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="pb-3">Delegación</th><th className="pb-3">Demanda</th><th className="pb-3">Espera</th><th className="pb-3">Capacidad</th><th className="pb-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.delegations.filter((item) => delegation === "todas" || item.name === delegation).map((item) => (
                  <tr key={item.name} className="text-sm">
                    <td className="py-3.5 font-extrabold text-foreground">{item.name}</td>
                    <td className="py-3.5 font-bold tabular-nums text-muted-foreground">{item.demand}%</td>
                    <td className="py-3.5 font-bold tabular-nums text-muted-foreground">{item.wait} min</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-muted-foreground" style={{ width: `${item.capacity}%` }} /></div>
                        <span className="text-xs font-bold tabular-nums text-muted-foreground">{item.capacity}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right"><Badge className={`rounded-full px-2.5 py-1 text-[0.66rem] font-bold ${statusStyle(item.status)}`}>{item.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
