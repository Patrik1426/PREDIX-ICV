// ============================================================
// Chatbot — vista previa del módulo 01 (Asistente Virtual Predictivo).
// Chat de texto libre real: llama trpc.ai.chat (LLM real, Gemini). No hay
// árbol de decisión ni respuestas pre-escritas — ver server/services/
// chatAssistant.ts para el system prompt y las reglas de privacidad.
// ============================================================

import { useState, type FormEvent } from "react";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function PreviewChatbot() {
  const [historial, setHistorial] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Hola, soy el asistente virtual del ICVNL. ¿En qué te puedo ayudar?",
    },
  ]);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const chat = trpc.ai.chat.useMutation();

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const mensaje = texto.trim();
    if (!mensaje || chat.isPending) return;

    setError(null);
    const siguienteHistorial: ChatMsg[] = [...historial, { role: "user", content: mensaje }];
    setHistorial(siguienteHistorial);
    setTexto("");

    chat.mutate(
      { messages: siguienteHistorial },
      {
        onSuccess: (data) => {
          if (data.success && data.reply) {
            setHistorial((h) => [...h, { role: "assistant", content: data.reply as string }]);
          } else {
            setError(data.message);
          }
        },
        onError: (err) => {
          if (err instanceof TRPCClientError && err.data?.code === "FORBIDDEN") {
            setError("Tu rol no tiene permiso para usar el asistente.");
          } else if (err instanceof TRPCClientError && err.data?.code === "UNAUTHORIZED") {
            setError("Requiere sesión iniciada.");
          } else {
            setError("No se pudo contactar al asistente.");
          }
        },
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="max-h-72 min-h-56 space-y-2 overflow-y-auto pr-1">
        {historial.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-xl px-3 py-2 text-sm",
              m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"
            )}
          >
            {m.content}
          </div>
        ))}
        {chat.isPending && (
          <div className="max-w-[85%] rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
            Escribiendo…
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <form onSubmit={enviar} className="flex items-center gap-2 border-t pt-3">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu pregunta…"
          disabled={chat.isPending}
          aria-label="Mensaje para el asistente"
        />
        <Button type="submit" size="icon" disabled={chat.isPending || !texto.trim()} aria-label="Enviar">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
