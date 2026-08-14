import { TrendingUp, DoorOpen, CalendarClock, Activity, MessageCircle, Settings } from "lucide-react";
import type { ReactNode } from "react";

export const MODULE_ICONS: Record<string, ReactNode> = {
  prediccion_demanda: <TrendingUp className="h-5 w-5" />,
  asignador_ventanillas: <DoorOpen className="h-5 w-5" />,
  citas: <CalendarClock className="h-5 w-5" />,
  monitor: <Activity className="h-5 w-5" />,
  chatbot: <MessageCircle className="h-5 w-5" />,
  admin: <Settings className="h-5 w-5" />,
};

// Orden real del flujo operativo descrito en la propuesta: predecir → asignar
// → agendar → monitorear. El asistente corre en paralelo, atendiendo al
// ciudadano en cualquier punto del proceso.
export const MODULE_ORDER = [
  "prediccion_demanda",
  "asignador_ventanillas",
  "citas",
  "monitor",
  "chatbot",
] as const;

// Un color distinto por módulo (de la paleta categórica ya definida en
// index.css --chart-1..5) para que el pipeline se lea de un vistazo, tanto
// en el sidebar como en las tarjetas. admin no es parte del pipeline —
// se queda neutro. Las clases están escritas completas (no interpoladas)
// para que Tailwind las detecte al escanear el código fuente.
export const MODULE_ACCENT: Record<string, { soft: string; text: string; solid: string; ring: string }> = {
  prediccion_demanda: { soft: "bg-chart-1/10", text: "text-chart-1", solid: "bg-chart-1", ring: "ring-chart-1/30" },
  asignador_ventanillas: { soft: "bg-chart-2/10", text: "text-chart-2", solid: "bg-chart-2", ring: "ring-chart-2/30" },
  citas: { soft: "bg-chart-5/10", text: "text-chart-5", solid: "bg-chart-5", ring: "ring-chart-5/30" },
  monitor: { soft: "bg-chart-4/10", text: "text-chart-4", solid: "bg-chart-4", ring: "ring-chart-4/30" },
  chatbot: { soft: "bg-chart-3/10", text: "text-chart-3", solid: "bg-chart-3", ring: "ring-chart-3/30" },
  admin: { soft: "bg-muted", text: "text-muted-foreground", solid: "bg-muted-foreground", ring: "ring-border" },
};
