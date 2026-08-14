import { Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type EstadoOperativo = "fluido" | "presion" | "saturado";

const ESTADO_BORDER: Record<EstadoOperativo, string> = {
  fluido: "border-l-status-fluido",
  presion: "border-l-status-presion",
  saturado: "border-l-status-saturado",
};

const ESTADO_LABEL: Record<EstadoOperativo, string> = {
  fluido: "Operando",
  presion: "Con presión",
  saturado: "Saturada",
};

const ESTADO_BADGE: Record<EstadoOperativo, string> = {
  fluido: "bg-status-fluido/10 text-status-fluido",
  presion: "bg-status-presion/10 text-status-presion",
  saturado: "bg-status-saturado/10 text-status-saturado",
};

export function VentanillaCard({
  ventanilla,
  operador,
  tramite,
  tiempoMin,
  atendidos,
  estado,
}: {
  ventanilla: string;
  operador: string;
  tramite: string;
  tiempoMin: number;
  atendidos: number;
  estado: EstadoOperativo;
}) {
  return (
    <div className={cn("rounded-lg border border-l-4 bg-card p-4", ESTADO_BORDER[estado])}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-lg font-bold">
          {ventanilla}
        </div>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", ESTADO_BADGE[estado])}>
          {ESTADO_LABEL[estado]}
        </span>
      </div>
      <div className="mt-3">
        <span className="font-semibold text-foreground">{operador}</span>
        <span className="ml-2 text-sm text-muted-foreground">{tramite}</span>
      </div>
      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {tiempoMin} min
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> {atendidos} atendidos
        </span>
      </div>
    </div>
  );
}
