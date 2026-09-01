// ============================================================
// AsistenteChat — el chat real del Asistente Virtual (LLM real, Gemini).
// Layout portado de predix-icvnl (Assistant.tsx: sidebar oscura + panel
// de chat + dictado por voz), recoloreado a tokens ICVNL — ver
// docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
// El estado y las llamadas reales (trpc.ai.chat, manejo de error
// 401/403/genérico) no cambian — es la única página de este port que
// conserva su backend real. El dictado por voz usa la Web Speech API real
// del navegador (SpeechRecognition), no es fabricado — si el navegador no
// la soporta, lo dice explícitamente en vez de fallar en silencio. Las
// preguntas sugeridas mantienen el contenido real ya existente (refrendo,
// delegaciones, citas) en vez del texto genérico de predix-icvnl.
//
// 2026-08-27: dividido en subcomponentes (client/src/components/asistente/)
// — mismo patrón ya aplicado a Tablero y PolicyStudio. El dictado se extrajo
// a useDictation() (antes duplicado inline, mismo shim que predix-icvnl
// nunca extrajo). La lista de mensajes gana role="log"+aria-live="polite"
// (gap real detectado en el review de la fuente, sin resolver hasta ahora).
// ============================================================

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BubbleBot } from "@/components/asistente/BubbleBot";
import { BubbleUser } from "@/components/asistente/BubbleUser";
import { LlmReal } from "@/components/asistente/LlmReal";
import { TypingIndicator } from "@/components/asistente/TypingIndicator";
import { useDictation } from "@/components/asistente/useDictation";
import type { ChatMsg } from "@/components/asistente/types";
import { Send, AlertTriangle, RefreshCw, Sparkles, Mic, MicOff } from "lucide-react";

const INITIAL: ChatMsg[] = [
  { role: "assistant", content: "Hola, soy el asistente virtual del ICVNL. ¿En qué te puedo ayudar?" },
];

const PREGUNTAS_SUGERIDAS = [
  "¿Qué documentos necesito para el refrendo?",
  "¿Qué delegación tiene menos espera ahorita?",
  "¿Cómo agendo una cita?",
];

export default function AsistenteChat() {
  const [historial, setHistorial] = useState<ChatMsg[]>(INITIAL);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const chat = trpc.ai.chat.useMutation();
  const finRef = useRef<HTMLDivElement>(null);

  const { isListening, dictar } = useDictation({
    onTranscript: (result) => setTexto((prev) => (prev ? `${prev} ${result}` : result)),
    onUnavailable: () => setError("El dictado no está disponible en este navegador. Puede escribir su consulta."),
  });

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

  return (
    <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
      <aside className="rounded-[1.4rem] bg-foreground p-5 text-background sm:p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"><Sparkles className="h-5 w-5 text-primary-foreground" aria-hidden="true" /></div>
        <h2 className="mt-5 text-xl font-extrabold tracking-[-0.04em]">Pensado para la conversación ejecutiva.</h2>
        <p className="mt-3 text-sm leading-6 text-background/70">Pregunte por trámites, delegaciones o citas sin buscar manualmente en cada módulo.</p>
        <div className="mt-6 space-y-3">
          <p className="text-[0.67rem] font-extrabold uppercase tracking-[0.14em] text-primary">Consultas sugeridas</p>
          {PREGUNTAS_SUGERIDAS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => mandar(p)}
              disabled={chat.isPending}
              data-testid="pregunta-sugerida"
              className="w-full rounded-xl border border-background/10 bg-background/[0.06] p-3 text-left text-sm leading-5 text-background transition-colors hover:bg-background/[0.11] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
        <p className="mt-6 border-t border-background/10 pt-4 text-xs leading-5 text-background/60">El dictado utiliza las capacidades disponibles del navegador. No se conserva audio.</p>
      </aside>

      <section className="flex h-[75vh] min-h-[560px] flex-col overflow-hidden rounded-[1.4rem] border bg-card shadow-sm">
        <div className="flex flex-shrink-0 items-center justify-between border-b bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground">P</span>
            <div>
              <p className="text-sm font-bold leading-tight">Asistente PREDIX</p>
              <div className="mt-0.5 flex items-center gap-1.5"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success" /><span className="font-mono text-[10px] uppercase tracking-wide text-success">En línea</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LlmReal />
            <button type="button" onClick={nuevaConversacion} data-testid="chat-nueva-conversacion" className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent" title="Nueva conversación">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />Nueva
            </button>
          </div>
        </div>

        <div role="log" aria-live="polite" aria-label="Historial de la conversación" className="flex-1 overflow-y-auto p-5">
          <div className="mx-auto max-w-2xl space-y-4">
            {historial.map((m, i) => m.role === "assistant" ? <BubbleBot key={i} content={m.content} /> : <BubbleUser key={i} content={m.content} />)}
            {chat.isPending && <TypingIndicator />}
            <div ref={finRef} />
          </div>
        </div>

        {error && (
          <div data-testid="chat-error" className="mx-5 mb-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span>{error}</span>
          </div>
        )}

        <form onSubmit={enviar} className="flex items-center gap-2 border-t bg-card p-3.5">
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Consulta sobre delegaciones, trámites, esperas…"
            disabled={chat.isPending}
            aria-label="Mensaje para el asistente"
            data-testid="chat-mensaje-input"
            className="h-11 rounded-full bg-muted/30 px-4"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={dictar}
            data-testid="chat-dictar"
            className={`h-11 w-11 shrink-0 rounded-full ${isListening ? "border-primary bg-primary/10 text-primary" : ""}`}
            title="Dictar consulta"
            aria-label="Dictar consulta"
          >
            {isListening ? <MicOff className="h-4 w-4" aria-hidden="true" /> : <Mic className="h-4 w-4" aria-hidden="true" />}
          </Button>
          <Button type="submit" size="icon" data-testid="chat-enviar" className="h-11 w-11 shrink-0 rounded-full" disabled={chat.isPending || !texto.trim()} aria-label="Enviar">
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </section>
    </div>
  );
}
