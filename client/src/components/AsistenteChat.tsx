// ============================================================
// AsistenteChat — el chat real del Asistente Virtual (LLM real, Gemini).
// Vive en client/src/pages/AsistenteVirtual.tsx. Layout/estilos portados
// de Preview Design (Figma Make) — ver
// docs/superpowers/specs/2026-08-21-port-preview-figma-design.md — pero
// el estado y las llamadas reales (trpc.ai.chat, manejo de error
// 401/403/genérico) no cambian: es la única página de este port que
// conserva su backend real. La "barra de contexto" de métricas fake y el
// texto "MODELO PREDIX-LLM v2.1" del mockup original se descartan a
// propósito (mismo criterio que ya se aplicó el 2026-08-20 al quitar los
// KPIs falsos de este componente) — se usa LlmReal en su lugar. Ver
// server/services/chatAssistant.ts para el system prompt y las reglas de
// privacidad.
// ============================================================

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, AlertTriangle, RefreshCw } from "lucide-react";

type ChatMsg = { role: "user" | "assistant"; content: string };

const INITIAL: ChatMsg[] = [
  { role: "assistant", content: "Hola, soy el asistente virtual del ICVNL. ¿En qué te puedo ayudar?" },
];

// Preguntas de arranque reales — cada clic dispara el LLM real (nunca una
// respuesta pre-escrita).
const PREGUNTAS_SUGERIDAS = [
  "¿Qué documentos necesito para el refrendo?",
  "¿Qué delegación tiene menos espera ahorita?",
  "¿Cómo agendo una cita?",
];

export function LlmReal() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      LLM real · Gemini
    </span>
  );
}

function renderConMarkdownBold(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-sm leading-relaxed" style={{ margin: i < lines.length - 1 ? "0 0 6px" : 0 }}>
        {parts.map((part, j) =>
          part.startsWith("**") ? (
            <strong key={j} className="font-semibold text-primary">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

function Avatar({ role }: { role: ChatMsg["role"] }) {
  if (role === "assistant") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
        P
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-accent text-xs font-bold text-muted-foreground">
      Tú
    </span>
  );
}

function BubbleBot({ content }: { content: string }) {
  return (
    <div className="flex max-w-[80%] items-start gap-2.5">
      <Avatar role="assistant" />
      <div className="rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm border bg-muted/40 px-4 py-3 shadow-sm">
        {renderConMarkdownBold(content)}
      </div>
    </div>
  );
}

function BubbleUser({ content }: { content: string }) {
  return (
    <div className="ml-auto flex max-w-[70%] flex-row-reverse items-start gap-2.5">
      <Avatar role="user" />
      <div className="rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-2.5">
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar role="assistant" />
      <div className="flex items-center gap-1.5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm border bg-muted/40 px-4 py-3.5">
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
  const [historial, setHistorial] = useState<ChatMsg[]>(INITIAL);
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

  const nuevaConversacion = () => {
    setHistorial(INITIAL);
    setTexto("");
    setError(null);
  };

  const esInicio = historial.length === 1;

  return (
    <div className="flex h-[75vh] min-h-[560px] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-shrink-0 items-center justify-between border-b bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base font-extrabold text-primary-foreground">
            P
          </span>
          <div>
            <p className="font-display text-sm font-bold leading-tight">Asistente PREDIX</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="font-mono text-[10px] uppercase tracking-wide text-success">En línea</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LlmReal />
          <button
            type="button"
            onClick={nuevaConversacion}
            className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent"
            title="Nueva conversación"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Nueva
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div className="mx-auto max-w-2xl space-y-4">
          {historial.map((m, i) =>
            m.role === "assistant" ? <BubbleBot key={i} content={m.content} /> : <BubbleUser key={i} content={m.content} />
          )}
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

      <form onSubmit={enviar} className="flex items-center gap-2 border-t bg-card p-3.5">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Consulta sobre delegaciones, trámites, esperas…"
          disabled={chat.isPending}
          aria-label="Mensaje para el asistente"
          className="h-11 rounded-full bg-muted/30 px-4"
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
