// ============================================================
// Chatbot — vista previa del módulo 05. Chat guiado, sin IA real todavía.
// Corre sobre @/lib/demoData, nunca el LLM real.
// ============================================================

import { useState } from "react";
import { DEMO_CHAT_GUION, DEMO_CHAT_OPCIONES, DEMO_CHATBOT_KPIS, DEMO_DEMANDA_HORARIA } from "@/lib/demoData";
import { KpiCard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Send, Timer, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMsg = { autor: "ciudadano" | "asistente"; texto: string };

export default function PreviewChatbot() {
  const [historial, setHistorial] = useState<ChatMsg[]>([
    { autor: "asistente", texto: DEMO_CHAT_GUION.inicio.texto },
  ]);
  const [nodoActual, setNodoActual] = useState("inicio");

  const opciones = DEMO_CHAT_GUION[nodoActual]?.siguiente ?? [];

  const elegir = (opcionId: string) => {
    const pregunta = DEMO_CHAT_OPCIONES[opcionId];
    const respuesta = DEMO_CHAT_GUION[opcionId];
    if (!pregunta || !respuesta) return;
    setHistorial((h) => [...h, { autor: "ciudadano", texto: pregunta }, { autor: "asistente", texto: respuesta.texto }]);
    setNodoActual(opcionId);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={<MessageCircle className="h-4 w-4" />}
          label="Consultas resueltas hoy"
          value={DEMO_CHATBOT_KPIS.consultasHoy}
          colorClassName="text-chart-3"
          spark={DEMO_DEMANDA_HORARIA}
        />
        <KpiCard
          icon={<Timer className="h-4 w-4" />}
          label="Tiempo de respuesta"
          value={DEMO_CHATBOT_KPIS.tiempoRespuestaSeg}
          suffix=" seg"
          colorClassName="text-chart-3"
          spark={DEMO_DEMANDA_HORARIA}
        />
      </div>
      <div className="space-y-3">
      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {historial.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-xl px-3 py-2 text-sm",
              m.autor === "ciudadano" ? "bg-muted text-foreground" : "ml-auto bg-primary text-primary-foreground"
            )}
          >
            {m.texto}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t pt-3">
        {opciones.map((id) => (
          <Button key={id} variant="outline" size="sm" className="h-auto whitespace-normal py-1.5 text-left" onClick={() => elegir(id)}>
            <Send className="mr-1.5 h-3 w-3 shrink-0" />
            {DEMO_CHAT_OPCIONES[id]}
          </Button>
        ))}
        {opciones.length === 0 && (
          <p className="text-xs text-muted-foreground">Fin del guion de demo.</p>
        )}
      </div>
      </div>
    </div>
  );
}
