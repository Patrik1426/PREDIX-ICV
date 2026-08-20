// ============================================================
// Citas — vista previa del módulo 03. Clic en un día abre el desglose de
// slots por hora. Corre sobre @/lib/demoData, nunca datos reales del ICVNL.
//
// Interactivo (2026-08-20): "Agendar cita" abre un formulario y agrega una
// cita simulada real a "Próximas atenciones" (client-side, se pierde al
// recargar — nunca se manda a ningún backend, no existe todavía). Trámites
// del catálogo (DEMO_TRAMITES) verificados contra los servicios reales del
// ICVNL (nl.gob.mx/es/controlvehicular): Refrendo, Licencias, Altas y bajas,
// Ponlo a tu Nombre son nombres reales de trámites del Instituto, no
// inventados para la demo.
// ============================================================

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  DEMO_CITAS_SEMANA,
  DEMO_SLOTS_CITAS,
  DEMO_PROXIMAS_ATENCIONES,
  DEMO_CITAS_HOY_KPIS,
  DEMO_DEMANDA_HORARIA,
  DEMO_TRAMITES,
} from "@/lib/demoData";
import { KpiCard, DataRow } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarClock, Users2, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type CitaSimulada = { hora: string; nombre: string; tramite: string; estado: "Programada" };

export default function PreviewCitas() {
  const [diaSeleccionado, setDiaSeleccionado] = useState(DEMO_CITAS_SEMANA[4].dia); // Viernes, pico
  const [citasSimuladas, setCitasSimuladas] = useState<CitaSimulada[]>([]);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tramite, setTramite] = useState<(typeof DEMO_TRAMITES)[number]>(DEMO_TRAMITES[0]);
  const [hora, setHora] = useState<string>(DEMO_SLOTS_CITAS[0].hora);
  const [error, setError] = useState<string | null>(null);

  const agendar = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("Escribe el nombre del ciudadano.");
      return;
    }
    setCitasSimuladas((cs) => [{ hora, nombre: nombre.trim(), tramite, estado: "Programada" }, ...cs]);
    toast.success("Cita agendada (simulación) — no se guarda al recargar la página.");
    setNombre("");
    setError(null);
    setDialogAbierto(false);
  };

  const proximasAtenciones = [...citasSimuladas, ...DEMO_PROXIMAS_ATENCIONES];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={<CalendarClock className="h-4 w-4" />}
          label="Citas hoy"
          value={DEMO_CITAS_HOY_KPIS.citasHoy + citasSimuladas.length}
          colorClassName="text-chart-5"
          spark={DEMO_DEMANDA_HORARIA}
        />
        <KpiCard
          icon={<Users2 className="h-4 w-4" />}
          label="En espera"
          value={DEMO_CITAS_HOY_KPIS.enEspera}
          colorClassName="text-chart-5"
          spark={DEMO_DEMANDA_HORARIA}
        />
      </div>
      <div className="space-y-4">
      {/* Altura en % solo resuelve contra un padre con altura fija — por eso
          el botón de cada día va directo como hijo de la fila h-24 (no en un
          wrapper flex-col de altura automática); la etiqueta va en su propia
          fila aparte, también clicable. */}
      <div className="flex h-24 gap-3">
        {DEMO_CITAS_SEMANA.map((c) => (
          <button
            key={c.dia}
            data-testid={`citas-semana-barra-${c.dia}`}
            onClick={() => setDiaSeleccionado(c.dia)}
            className="group flex h-full flex-1 flex-col justify-end"
          >
            <div
              className={cn(
                "w-full rounded-t-sm transition-colors",
                c.dia === diaSeleccionado ? "bg-primary" : "bg-chart-2 group-hover:opacity-80"
              )}
              style={{ height: `${Math.round(c.ocupacion * 100)}%` }}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 flex gap-3">
        {DEMO_CITAS_SEMANA.map((c) => (
          <button
            key={c.dia}
            onClick={() => setDiaSeleccionado(c.dia)}
            className={cn(
              "flex-1 text-center text-xs",
              c.dia === diaSeleccionado ? "font-semibold text-foreground" : "text-muted-foreground"
            )}
          >
            {c.dia}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="mb-2 text-xs font-medium">Slots del {diaSeleccionado} — ejemplo de distribución por hora</p>
        <div className="space-y-1.5">
          {DEMO_SLOTS_CITAS.map((s) => (
            <div key={s.hora} className="flex items-center gap-2 text-xs">
              <span className="w-14 shrink-0 text-muted-foreground">{s.hora}</span>
              <div className="flex h-4 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-chart-3"
                  style={{ width: `${(s.demandaWalkIn / s.capacidadTotal) * 100}%` }}
                  title="Walk-in"
                />
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(s.slotsCita / s.capacidadTotal) * 100}%` }}
                  title="Citas"
                />
              </div>
              <span className="w-20 shrink-0 text-right text-muted-foreground">{s.capacidadTotal} atn.</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-chart-3" /> Walk-in</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Con cita</span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Próximas atenciones</h3>
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> Agendar cita
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar cita de prueba</DialogTitle>
              </DialogHeader>
              <form onSubmit={agendar} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cita-nombre">Nombre del ciudadano</Label>
                  <Input
                    id="cita-nombre"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Nombre completo"
                  />
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cita-tramite">Trámite</Label>
                  <select
                    id="cita-tramite"
                    value={tramite}
                    onChange={(e) => setTramite(e.target.value as (typeof DEMO_TRAMITES)[number])}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    {DEMO_TRAMITES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cita-hora">Hora</Label>
                  <select
                    id="cita-hora"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    {DEMO_SLOTS_CITAS.map((s) => (
                      <option key={s.hora} value={s.hora}>
                        {s.hora}
                      </option>
                    ))}
                  </select>
                </div>
                <DialogFooter>
                  <Button type="submit">Confirmar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-lg border bg-card px-4">
          {proximasAtenciones.map((a, i) => (
            <DataRow
              key={a.hora + a.nombre + i}
              icon={<Clock className="h-4 w-4" />}
              label={`${a.nombre} — ${a.tramite}`}
              value={`${a.hora} · ${a.estado}`}
              colorClassName="text-chart-5"
              last={i === proximasAtenciones.length - 1}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
