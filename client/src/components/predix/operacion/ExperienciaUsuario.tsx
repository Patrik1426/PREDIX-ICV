import { MessageSquareHeart, ShieldCheck, Star, ThumbsUp, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEstadoBadgeClass } from "@/lib/estadoSeverity";
import type { operationsData } from "@/lib/predixDemoData";

type ExperienciaUsuarioProps = {
  experience: (typeof operationsData)["userExperience"];
};

export function ExperienciaUsuario({ experience }: ExperienciaUsuarioProps) {
  const metrics = [
    { label: "Experiencia general", value: `${experience.experienceScore} / 5`, delta: experience.experienceDelta, detail: "calificación promedio", icon: Star, color: "bg-primary/10 text-primary" },
    { label: "Calidad del servicio", value: `${experience.serviceQualityPct}%`, delta: experience.serviceQualityDelta, detail: "personas satisfechas con la atención", icon: ShieldCheck, color: "bg-chart-2/10 text-chart-2" },
    { label: "Satisfacción (CSAT)", value: `${experience.satisfactionPct}%`, delta: experience.satisfactionDelta, detail: "respuestas favorables", icon: ThumbsUp, color: "bg-success/10 text-success" },
    { label: "Recomendación (NPS)", value: `+${experience.nps}`, delta: "estable", detail: `${experience.responseRate}% de tasa de respuesta`, icon: UserRoundCheck, color: "bg-chart-5/10 text-chart-5" },
  ];

  return (
    <section data-testid="csat-section" className="rounded-[1.4rem] border border-border bg-card p-5 shadow-[var(--shadow-md)] sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="h-4 w-4 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Experiencia de usuario y calidad de servicio</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Indicadores obtenidos mediante encuestas de satisfacción, con foco en atención, claridad y resolución.</p>
        </div>
        <Badge className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10">{experience.surveyResponses.toLocaleString("es-MX")} encuestas · {experience.period}</Badge>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} data-testid="metric-card" className="rounded-2xl border border-border p-4">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.color}`}><Icon className="h-4.5 w-4.5" aria-hidden="true" /></span>
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
              <div key={item.name} data-testid="calificacion-item" className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div><p className="text-sm font-bold text-foreground">{item.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.comments} comentarios recibidos</p></div>
                <div className="text-right"><p className="text-sm font-extrabold text-foreground">{item.score} / 5</p><p className="mt-0.5 text-xs font-bold text-success">{item.quality}% calidad</p></div>
                <Badge className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${getEstadoBadgeClass(item.status, { destacados: ["Destacado"] })}`}>{item.status}</Badge>
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
  );
}
