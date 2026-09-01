// ============================================================
// PrediccionYAsignacion — reemplazo total con el diseño de predix-icvnl
// (Predictions.tsx), recoloreado a tokens ICVNL. El guard de RBAC a nivel
// de página se conserva (no es un elemento de diseño, es el control de
// acceso real) — ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// El gating granular por tab que existía antes de este port se pierde,
// como el resto de la interactividad — trabajo de reintegración futuro.
// ============================================================

import { Redirect } from "wouter";
import { trpc } from "@/lib/trpc";
import { hasGroupAccess } from "@/lib/moduleGroups";
import { DemoNotice } from "@/components/predix/DemoNotice";
import { PageHeader } from "@/components/predix/PageHeader";
import { Badge } from "@/components/ui/badge";
import { predictionData } from "@/lib/predixDemoData";
import { ArrowDownRight, ArrowUpRight, BrainCircuit, ChartNoAxesCombined, Clock3, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function PrediccionYAsignacion() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();

  if (!isLoading && !hasGroupAccess("prediccion_asignacion", accessibleModules)) return <Redirect to="/" />;

  const data = predictionData;
  const cards = [
    ["Demanda próxima semana", data.summary.nextWeek, "vs. línea base", ChartNoAxesCombined, "text-primary bg-primary/10"],
    ["Riesgo de saturación", data.summary.risk, "3 delegaciones bajo vigilancia", Gauge, "text-chart-2 bg-chart-2/10"],
    ["Brecha de capacidad", `${data.summary.capacityGap} ventanillas`, "en horas de mayor presión", Clock3, "text-chart-3 bg-chart-3/10"],
    ["Calidad del pronóstico", `${data.summary.confidence}%`, "validación sobre histórico", ShieldCheck, "text-success bg-success/10"],
  ] as const;

  return (
    <div className="container py-10">
      <PageHeader
        eyebrow="Inteligencia predictiva"
        title="Anticipar la presión antes de que se convierta en fila"
        description="Escenarios de demanda, carga de atención e ingresos para orientar decisiones de capacidad y canalización con trazabilidad metodológica."
        action={<Badge className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background hover:bg-foreground"><BrainCircuit className="mr-1.5 h-3.5 w-3.5" />Confianza del modelo: {data.summary.confidence}%</Badge>}
      />
      <DemoNotice text={data.notice} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, description, Icon, color]) => (
          <article key={label} className="rounded-[1.35rem] border border-border bg-card p-5 shadow-[var(--shadow-md)]">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}><Icon className="h-4.5 w-4.5" /></div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-extrabold tracking-[-0.045em] text-foreground">{value}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Curva de demanda prevista</h2>
            <p className="mt-1 text-sm text-muted-foreground">Volumen esperado de trámites por día, con escenarios base, favorable y de presión.</p>
          </div>
          <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">Horizonte: 7 días</span>
            <span className="rounded-full bg-muted px-3 py-1.5">Actualizado hoy</span>
          </div>
        </div>
        <div className="mt-5 h-[310px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.series} margin={{ top: 8, right: 5, left: -18, bottom: 0 }}>
              <defs><linearGradient id="baseFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.27} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.01} /></linearGradient></defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid var(--color-border)", boxShadow: "var(--shadow-popover)" }} />
              <Legend wrapperStyle={{ paddingTop: 14, fontSize: 12 }} />
              <Area type="monotone" name="Escenario base" dataKey="base" stroke="var(--color-primary)" strokeWidth={3} fill="url(#baseFill)" />
              <Area type="monotone" name="Favorable" dataKey="favorable" stroke="var(--color-muted-foreground)" strokeWidth={2} fill="transparent" strokeDasharray="5 4" />
              <Area type="monotone" name="Presión" dataKey="stress" stroke="var(--color-destructive)" strokeWidth={2} fill="transparent" strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Factores explicativos</h2></div>
          <div className="mt-4 divide-y divide-border">
            {data.factors.map((factor) => (
              <div key={factor.label} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${factor.direction === "up" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>
                  {factor.direction === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3"><p className="font-bold text-foreground">{factor.label}</p><span className="text-sm font-extrabold text-foreground">{factor.impact}</span></div>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{factor.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="overflow-hidden rounded-[1.4rem] bg-foreground p-5 text-background sm:p-6">
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-primary">Recomendación de capacidad</p>
          <h2 className="mt-2 text-xl font-extrabold tracking-[-0.04em]">Ajuste antes del pico</h2>
          <div className="mt-5 space-y-3">
            {data.capacityPlan.map((plan) => (
              <div key={plan.delegation} className="rounded-xl bg-background/[0.08] p-3.5">
                <div className="flex items-center justify-between gap-3"><p className="font-bold">{plan.delegation}</p><p className="text-sm font-extrabold text-primary">{plan.current} → {plan.suggested}</p></div>
                <p className="mt-1.5 text-xs leading-5 text-background/70">{plan.reason}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
