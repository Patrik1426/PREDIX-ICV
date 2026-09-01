// ============================================================
// CitasYOperacion — reemplazo total con el diseño de predix-icvnl
// (Operations.tsx), recoloreado a tokens ICVNL. El guard de RBAC a nivel
// de página se conserva — ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// El gating granular por sección (citas/monitor) que existía antes de
// este port se pierde, como el resto de la interactividad — trabajo de
// reintegración futuro.
// ============================================================

import { Redirect } from "wouter";
import { trpc } from "@/lib/trpc";
import { hasGroupAccess } from "@/lib/moduleGroups";
import { DemoNotice } from "@/components/predix/DemoNotice";
import { PageHeader } from "@/components/predix/PageHeader";
import { Badge } from "@/components/ui/badge";
import { operationsData } from "@/lib/predixDemoData";
import { Activity, AlertTriangle, Building2, Clock3, MessageSquareHeart, ShieldCheck, Star, ThumbsUp, UserRoundCheck } from "lucide-react";

const heatColor = (value: number) =>
  value >= 92 ? "bg-destructive text-destructive-foreground" :
  value >= 78 ? "bg-chart-2 text-foreground" :
  value >= 60 ? "bg-chart-2/30 text-foreground" :
  "bg-success/15 text-success";

const statusClass = (status: string) =>
  status === "Atención" ? "bg-destructive/10 text-destructive hover:bg-destructive/10" :
  status === "Destacado" ? "bg-primary/10 text-primary hover:bg-primary/10" :
  "bg-success/10 text-success hover:bg-success/10";

export default function CitasYOperacion() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();

  if (!isLoading && !hasGroupAccess("citas_operacion", accessibleModules)) return <Redirect to="/" />;

  const data = operationsData;
  const locations = ["Pabellon", "Guadalupe", "San Nicolás", "Apodaca"] as const;
  const experience = data.userExperience;

  return (
    <div className="container py-10">
      <PageHeader
        eyebrow="Operación institucional"
        title="Visibilidad para intervenir en el momento correcto"
        description="Monitoreo demostrativo de capacidad, demanda, experiencia usuaria e incidencias por delegación para coordinar acciones de corto plazo."
        action={<Badge className="rounded-full bg-success/10 px-3.5 py-1.5 text-xs font-bold text-success hover:bg-success/10"><Activity className="mr-1.5 h-3.5 w-3.5" />Actualización operativa simulada</Badge>}
      />
      <DemoNotice text={data.notice} />

      <section className="rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2"><MessageSquareHeart className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Experiencia de usuario y calidad de servicio</h2></div>
            <p className="mt-1 text-sm text-muted-foreground">Indicadores obtenidos mediante encuestas de satisfacción, con foco en atención, claridad y resolución.</p>
          </div>
          <Badge className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10">{experience.surveyResponses.toLocaleString("es-MX")} encuestas · {experience.period}</Badge>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Experiencia general", value: `${experience.experienceScore} / 5`, delta: experience.experienceDelta, detail: "calificación promedio", icon: Star, color: "bg-primary/10 text-primary" },
            { label: "Calidad del servicio", value: `${experience.serviceQualityPct}%`, delta: experience.serviceQualityDelta, detail: "personas satisfechas con la atención", icon: ShieldCheck, color: "bg-chart-2/10 text-chart-2" },
            { label: "Satisfacción (CSAT)", value: `${experience.satisfactionPct}%`, delta: experience.satisfactionDelta, detail: "respuestas favorables", icon: ThumbsUp, color: "bg-success/10 text-success" },
            { label: "Recomendación (NPS)", value: `+${experience.nps}`, delta: "estable", detail: `${experience.responseRate}% de tasa de respuesta`, icon: UserRoundCheck, color: "bg-chart-5/10 text-chart-5" },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <article key={metric.label} className="rounded-2xl border border-border p-4">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.color}`}><Icon className="h-4.5 w-4.5" /></span>
                <p className="mt-4 text-[0.67rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</p>
                <div className="mt-1 flex items-end justify-between gap-3"><p className="text-2xl font-extrabold tracking-[-0.045em] text-foreground">{metric.value}</p><span className="mb-1 text-xs font-extrabold text-success">{metric.delta}</span></div>
                <p className="mt-1.5 text-xs text-muted-foreground">{metric.detail}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl bg-muted p-4">
            <div className="flex items-center justify-between"><h3 className="font-extrabold text-foreground">Calificación por delegación</h3><span className="text-xs font-bold text-muted-foreground">escala 1–5</span></div>
            <div className="mt-3 divide-y divide-border">
              {experience.byDelegation.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div><p className="text-sm font-bold text-foreground">{item.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.comments} comentarios recibidos</p></div>
                  <div className="text-right"><p className="text-sm font-extrabold text-foreground">{item.score} / 5</p><p className="mt-0.5 text-xs font-bold text-success">{item.quality}% calidad</p></div>
                  <Badge className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${statusClass(item.status)}`}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between"><h3 className="font-extrabold text-foreground">Atributos evaluados</h3><span className="text-xs font-bold text-primary">Voz del usuario</span></div>
            <div className="mt-3 space-y-3">
              {experience.drivers.map((driver) => (
                <div key={driver.label}>
                  <div className="flex justify-between gap-3 text-xs"><p className="font-bold text-muted-foreground">{driver.label}</p><p className="font-extrabold text-foreground">{driver.value}%</p></div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${driver.value < 85 ? "bg-chart-2" : "bg-success"}`} style={{ width: `${driver.value}%` }} /></div>
                  <p className="mt-1 text-[0.65rem] text-muted-foreground">{driver.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Estado de delegaciones</h2><p className="mt-1 text-sm text-muted-foreground">Indicadores relevantes para la coordinación diaria y reasignación de capacidad.</p></div>
          <span className="text-xs font-bold text-muted-foreground">Corte: 17:30 h</span>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[760px] w-full text-left">
            <thead>
              <tr className="border-b border-border text-[0.67rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                <th className="pb-3">Delegación</th><th className="pb-3">Fila</th><th className="pb-3">Espera</th><th className="pb-3">Ocupación</th><th className="pb-3">Ventanillas</th><th className="pb-3 text-right">Condición</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.delegationStatus.map((item) => (
                <tr key={item.name} className="text-sm">
                  <td className="py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground"><Building2 className="h-4 w-4" /></span><div><p className="font-extrabold text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{item.city}</p></div></div></td>
                  <td className="py-4 font-bold text-foreground">{item.queue}</td>
                  <td className="py-4 font-bold text-foreground">{item.wait} min</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${item.capacity >= 90 ? "bg-destructive" : item.capacity >= 80 ? "bg-chart-2" : "bg-success"}`} style={{ width: `${item.capacity}%` }} /></div>
                      <span className="text-xs font-bold text-muted-foreground">{item.capacity}%</span>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-foreground">{item.counters}</td>
                  <td className="py-4 text-right"><Badge className={`rounded-full px-2.5 py-1 text-[0.67rem] font-bold ${item.status === "Saturación" ? "bg-destructive/10 text-destructive hover:bg-destructive/10" : "bg-success/10 text-success hover:bg-success/10"}`}>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Matriz de demanda por franja horaria</h2></div>
          <p className="mt-1 text-sm text-muted-foreground">Intensidad relativa de llegada de personas por delegación.</p>
          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[650px]">
              <div className="grid grid-cols-[70px_repeat(4,minmax(0,1fr))] gap-2">
                <div />
                <div className="px-2 text-center text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">Pabellón</div>
                <div className="px-2 text-center text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">Guadalupe</div>
                <div className="px-2 text-center text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">San Nicolás</div>
                <div className="px-2 text-center text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">Apodaca</div>
                {data.hourlyHeat.flatMap((row) => [
                  <div key={`${row.hour}-label`} className="flex items-center text-xs font-bold text-muted-foreground">{row.hour}:00</div>,
                  ...locations.map((location) => {
                    const value = row[location];
                    return <div key={`${row.hour}-${location}`} className={`flex h-10 items-center justify-center rounded-lg text-xs font-extrabold ${heatColor(value)}`}>{value}</div>;
                  }),
                ])}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3 text-[0.66rem] font-semibold text-muted-foreground">
            <span>Baja</span><span className="h-2 w-7 rounded-full bg-success/15" /><span className="h-2 w-7 rounded-full bg-chart-2/30" /><span className="h-2 w-7 rounded-full bg-destructive" /><span>Alta</span>
          </div>
        </section>
        <section className="rounded-[1.4rem] bg-accent p-5 sm:p-6">
          <div className="flex items-center gap-2"><UserRoundCheck className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-accent-foreground">Acción sugerida</h2></div>
          <p className="mt-3 text-sm leading-6 text-accent-foreground/80">La capacidad de Guadalupe se acerca al límite entre 10:00 y 12:00 h. Las encuestas también señalan el tiempo de espera como principal fricción, por lo que se recomienda activar personal multitrámite y transferir citas flexibles a la franja vespertina.</p>
          <div className="mt-5 rounded-xl border border-border bg-card/60 p-4">
            <p className="text-[0.67rem] font-extrabold uppercase tracking-[0.12em] text-primary">Respuesta operativa</p>
            <p className="mt-2 text-2xl font-extrabold tracking-[-0.045em] text-accent-foreground">+2 ventanillas</p>
            <p className="mt-1 text-xs leading-5 text-accent-foreground/70">Preasignación recomendada durante la ventana crítica.</p>
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Incidencias y señales de operación</h2></div>
        <div className="mt-4 divide-y divide-border">
          {data.incidents.map((incident) => (
            <article key={`${incident.time}-${incident.delegation}`} className="grid gap-2 py-4 first:pt-0 sm:grid-cols-[64px_150px_1fr_auto] sm:items-center">
              <p className="text-sm font-extrabold text-primary">{incident.time}</p>
              <div><p className="font-bold text-foreground">{incident.delegation}</p><p className="text-xs text-muted-foreground">{incident.type}</p></div>
              <p className="text-sm leading-5 text-muted-foreground">{incident.detail}</p>
              <Badge variant="outline" className="w-fit text-[0.67rem] font-bold text-muted-foreground">{incident.owner}</Badge>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
