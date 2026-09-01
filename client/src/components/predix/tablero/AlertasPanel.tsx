import { BellRing, CircleAlert } from "lucide-react";

type Alert = { severity: string; title: string; detail: string; action: string };

type AlertasPanelProps = {
  alerts: readonly Alert[];
};

const alertStyle = (severity: string) =>
  severity === "high" ? "bg-destructive/10 text-destructive" : severity === "medium" ? "bg-chart-2/10 text-chart-2" : "bg-success/10 text-success";

export function AlertasPanel({ alerts }: AlertasPanelProps) {
  return (
    <section className="min-w-0 rounded-[1.4rem] border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2"><BellRing className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">Alertas priorizadas</h2></div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Próximamente"
          data-testid="alertas-ver-todas"
          className="text-xs font-bold text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ver todas
        </button>
      </div>
      <div className="mt-4 space-y-2.5">
        {alerts.map((alert) => (
          <article key={alert.title} data-testid="alerta-item" className="rounded-xl border border-border p-3.5">
            <div className="flex gap-3">
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${alertStyle(alert.severity)}`}><CircleAlert className="h-4 w-4" aria-hidden="true" /></span>
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
  );
}
