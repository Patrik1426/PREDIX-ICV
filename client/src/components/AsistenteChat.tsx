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
// ============================================================

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, AlertTriangle, RefreshCw, Sparkles, Mic, MicOff } from "lucide-react";

type ChatMsg = { role: "user" | "assistant"; content: string };

const INITIAL: ChatMsg[] = [
  { role: "assistant", content: "Hola, soy el asistente virtual del ICVNL. ¿En qué te puedo ayudar?" },
];

const PREGUNTAS_SUGERIDAS = [
  "¿Qué documentos necesito para el refrendo?",
  "¿Qué delegación tiene menos espera ahorita?",
  "¿Cómo agendo una cita?",
];

type BrowserRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type BrowserRecognitionConstructor = new () => BrowserRecognition;

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
            <strong key={j} className="font-semibold text-primary">{part.slice(2, -2)}</strong>
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
    return <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">P</span>;
  }
  return <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-accent text-xs font-bold text-muted-foreground">Tú</span>;
}

function BubbleBot({ content }: { content: string }) {
  return (
    <div className="flex max-w-[80%] items-start gap-2.5">
      <Avatar role="assistant" />
      <div className="rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm border bg-muted/40 px-4 py-3 shadow-sm">{renderConMarkdownBold(content)}</div>
    </div>
  );
}

function BubbleUser({ content }: { content: string }) {
  return (
    <div className="ml-auto flex max-w-[70%] flex-row-reverse items-start gap-2.5">
      <Avatar role="user" />
      <div className="rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-2.5"><p className="text-sm leading-relaxed">{content}</p></div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar role="assistant" />
      <div className="flex items-center gap-1.5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm border bg-muted/40 px-4 py-3.5">
        {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-pulse motion-reduce:animate-none rounded-full bg-muted-foreground/60" style={{ animationDelay: `${i * 150}ms` }} />)}
      </div>
    </div>
  );
}

export default function AsistenteChat() {
  const [historial, setHistorial] = useState<ChatMsg[]>(INITIAL);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chat = trpc.ai.chat.useMutation();
  const finRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<BrowserRecognition | null>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [historial, chat.isPending]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

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

  const dictar = () => {
    const recognitionWindow = window as unknown as {
      SpeechRecognition?: BrowserRecognitionConstructor;
      webkitSpeechRecognition?: BrowserRecognitionConstructor;
    };
    const Recognition = recognitionWindow.SpeechRecognition || recognitionWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError("El dictado no está disponible en este navegador. Puede escribir su consulta.");
      return;
    }
    recognitionRef.current?.stop();
    const recognition = new Recognition();
    recognition.lang = "es-MX";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
      if (result) setTexto((prev) => (prev ? `${prev} ${result.trim()}` : result.trim()));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
      <aside className="rounded-[1.4rem] bg-foreground p-5 text-background sm:p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
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
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground">P</span>
            <div>
              <p className="text-sm font-bold leading-tight">Asistente PREDIX</p>
              <div className="mt-0.5 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" /><span className="font-mono text-[10px] uppercase tracking-wide text-success">En línea</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LlmReal />
            <button type="button" onClick={nuevaConversacion} className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent" title="Nueva conversación">
              <RefreshCw className="h-3.5 w-3.5" />Nueva
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="mx-auto max-w-2xl space-y-4">
            {historial.map((m, i) => m.role === "assistant" ? <BubbleBot key={i} content={m.content} /> : <BubbleUser key={i} content={m.content} />)}
            {chat.isPending && <TypingIndicator />}
            <div ref={finRef} />
          </div>
        </div>

        {error && (
          <div className="mx-5 mb-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{error}</span>
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
            type="button"
            variant="outline"
            size="icon"
            onClick={dictar}
            className={`h-11 w-11 shrink-0 rounded-full ${isListening ? "border-primary bg-primary/10 text-primary" : ""}`}
            title="Dictar consulta"
            aria-label="Dictar consulta"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-full" disabled={chat.isPending || !texto.trim()} aria-label="Enviar">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </section>
    </div>
  );
}
