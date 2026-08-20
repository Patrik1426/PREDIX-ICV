// ============================================================
// AsistenteChat — el chat real del Asistente Virtual (LLM real, Gemini).
// Vive en client/src/pages/AsistenteVirtual.tsx, ya no dentro del shell de
// "vista previa" de ModuloDetalle.tsx — este módulo dejó de ser un preview,
// funciona de verdad. Ver server/services/chatAssistant.ts para el system
// prompt y las reglas de privacidad.
// ============================================================

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMsg = { role: "user" | "assistant"; content: string };

export function LlmReal() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      LLM real · Gemini
    </span>
  );
}

// Preguntas de arranque reales — cada clic dispara el LLM real (nunca una
// respuesta pre-escrita, a diferencia del árbol de decisión que reemplazó
// este componente).
const PREGUNTAS_SUGERIDAS = [
  "¿Qué documentos necesito para el refrendo?",
  "¿Qué delegación tiene menos espera ahorita?",
  "¿Cómo agendo una cita?",
];

function Avatar({ role }: { role: ChatMsg["role"] }) {
  if (role === "assistant") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chart-3/10 text-chart-3">
        <Bot className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
      Tú
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <Avatar role="assistant" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3 py-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse motion-reduce:animate-none rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AsistenteChat() {
  const [historial, setHistorial] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Hola, soy el asistente virtual del ICVNL. ¿En qué te puedo ayudar?",
    },
  ]);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const chat = trpc.ai.chat.useMutation();
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [historial, chat.isPending]);

  const mandar = (mensaje: string) => {
    const limpio = mensaje.trim();
    if (!limpio || chat.isPending) return;

    setError(null);
    const siguienteHistorial: ChatMsg[] = [...historial, { role: "user", content: limpio }];
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

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    mandar(texto);
  };

  const esInicio = historial.length === 1;

  return (
    <div className="flex h-[75vh] min-h-[560px] flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center gap-2.5 border-b bg-muted/40 px-5 py-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chart-3/10 text-chart-3">
          <Bot className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">Asistente Virtual</p>
          <p className="truncate text-xs text-muted-foreground leading-tight">Consultas ciudadanas del ICVNL</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div className="mx-auto max-w-2xl space-y-4">
          {historial.map((m, i) => (
            <div key={i} className={cn("flex items-end gap-2", m.role === "user" && "flex-row-reverse")}>
              <Avatar role={m.role} />
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted text-foreground"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {chat.isPending && <TypingIndicator />}

          {esInicio && !chat.isPending && (
            <div className="flex flex-wrap gap-2 pl-10">
              {PREGUNTAS_SUGERIDAS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => mandar(p)}
                  className="cursor-pointer rounded-full border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <div ref={finRef} />
        </div>
      </div>

      {error && (
        <div className="mx-5 mb-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={enviar} className="flex items-center gap-2 border-t p-3.5">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu pregunta…"
          disabled={chat.isPending}
          aria-label="Mensaje para el asistente"
          className="h-11 rounded-full bg-background px-4"
        />
        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-full"
          disabled={chat.isPending || !texto.trim()}
          aria-label="Enviar"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
