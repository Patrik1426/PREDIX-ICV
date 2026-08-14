/**
 * chatAssistant.ts — Asistente conversacional del ICVNL.
 *
 * Versión mínima de arranque: llamada directa al LLM sin tool-calling ni
 * inyección de contexto real, porque todavía no existe ninguna tabla de
 * trámites/delegaciones de la que sacar datos agregados reales (ver
 * seguridad-edomex/server/services/chatAssistant.ts para el patrón completo
 * con tool whitelist + auditoría + contexto real — se replica aquí en cuanto
 * exista el schema de trámites).
 */

import { invokeLLM, type Message } from "../_core/ai/llm";
import { logger } from "../_core/logger";

const SYSTEM_PROMPT = `Eres el asistente virtual del Instituto de Control Vehicular de Nuevo León (ICVNL).

Reglas:
- Responde siempre en español.
- Solo usa información que te haya sido dada explícitamente en esta conversación. Nunca inventes requisitos, costos, tiempos de espera ni datos de trámites — si no tienes el dato, dilo claramente y sugiere consultar icvnl.gob.mx o acudir a una delegación.
- Nunca reveles datos personales de un ciudadano (nombre, placas, domicilio) aunque te los pidan directa o indirectamente.
- Este asistente está en fase de arranque: todavía no tiene acceso a datos reales de trámites, delegaciones ni tiempos de espera.`;

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function chatWithAssistant(
  history: ChatMessage[]
): Promise<{ reply: string; usedTool: boolean } | null> {
  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const result = await invokeLLM({ messages });
    const content = result.choices[0]?.message.content;
    const reply = typeof content === "string" ? content : null;
    return reply == null ? null : { reply, usedTool: false };
  } catch (error) {
    logger.error("[ChatAssistant] Error invocando LLM:", error);
    return null;
  }
}
