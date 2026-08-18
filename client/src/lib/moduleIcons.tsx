// client/src/lib/moduleIcons.tsx
import { TrendingUp, CalendarClock, MessageCircle, Settings } from "lucide-react";
import type { ReactNode } from "react";

export const MODULE_ICONS: Record<string, ReactNode> = {
  prediccion_asignacion: <TrendingUp className="h-5 w-5" />,
  citas_operacion: <CalendarClock className="h-5 w-5" />,
  chatbot: <MessageCircle className="h-5 w-5" />,
  admin: <Settings className="h-5 w-5" />,
};

// Orden real del flujo operativo: predecir+asignar → agendar+monitorear. El
// asistente corre en paralelo, atendiendo al ciudadano en cualquier punto
// del proceso.
export const MODULE_ORDER = ["prediccion_asignacion", "citas_operacion", "chatbot"] as const;

// Un color distinto por módulo (paleta categórica --chart-1..5) para que el
// pipeline se lea de un vistazo. admin no es parte del pipeline — neutro.
export const MODULE_ACCENT: Record<
  string,
  { soft: string; text: string; solid: string; ring: string }
> = {
  prediccion_asignacion: { soft: "bg-chart-1/10", text: "text-chart-1", solid: "bg-chart-1", ring: "ring-chart-1/30" },
  citas_operacion: { soft: "bg-chart-5/10", text: "text-chart-5", solid: "bg-chart-5", ring: "ring-chart-5/30" },
  chatbot: { soft: "bg-chart-3/10", text: "text-chart-3", solid: "bg-chart-3", ring: "ring-chart-3/30" },
  admin: { soft: "bg-muted", text: "text-muted-foreground", solid: "bg-muted-foreground", ring: "ring-border" },
};
