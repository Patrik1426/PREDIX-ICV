/**
 * ai.ts — Procedimientos tRPC para el asistente conversacional del ICVNL.
 */

import { z } from "zod";
import { requirePermission, router } from "../_core/infra/trpc";
import { MODULES } from "../_core/infra/permissions";
import { chatWithAssistant } from "../services/chatAssistant";
import { logAudit } from "../config/auditLog";

export const aiRouter = router({
  chat: requirePermission(MODULES.CHATBOT, "canView")
    .input(
      z.object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1),
            })
          )
          .min(1)
          .max(20),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await chatWithAssistant(input.messages);

      await logAudit({
        userId: ctx.user.id,
        action: "AI_CHAT",
        module: "chatbot",
        ip: ctx.req.ip || "unknown",
      });

      if (result == null) {
        return {
          success: false,
          message: "El asistente no está disponible en este momento.",
          reply: null,
        };
      }

      return { success: true, message: "Respuesta generada", reply: result.reply };
    }),
});
