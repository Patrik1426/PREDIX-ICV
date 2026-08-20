import { describe, expect, it, vi, afterEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/auth/context";
import { chatWithAssistant } from "../services/chatAssistant";

vi.mock("../services/chatAssistant", () => ({
  chatWithAssistant: vi.fn(),
}));

const mockedChatWithAssistant = vi.mocked(chatWithAssistant);

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

const AUTH_USER: AuthenticatedUser = {
  id: 1,
  openId: "sample-user",
  email: "sample@example.com",
  name: "Sample User",
  loginMethod: "manus",
  role: "user",
  institutionalRole: "cajero",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {}, ip: "127.0.0.1" } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("ai.chat", () => {
  afterEach(() => vi.clearAllMocks());

  it("rechaza sin sesión", async () => {
    const caller = appRouter.createCaller(createContext(null));
    try {
      await caller.ai.chat({ messages: [{ role: "user", content: "hola" }] });
      throw new Error("esperaba que rechazara");
    } catch (e) {
      expect((e as TRPCError).code).toBe("UNAUTHORIZED");
    }
  });

  it("devuelve la respuesta del asistente para una sesión autenticada (todos los roles tienen canView en chatbot)", async () => {
    mockedChatWithAssistant.mockResolvedValue({ reply: "Puedes tramitar el refrendo en cualquier delegación.", usedTool: false });

    const caller = appRouter.createCaller(createContext(AUTH_USER));
    const result = await caller.ai.chat({ messages: [{ role: "user", content: "¿Dónde tramito el refrendo?" }] });

    expect(result).toEqual({ success: true, message: "Respuesta generada", reply: "Puedes tramitar el refrendo en cualquier delegación." });
  });

  it("responde success:false con mensaje honesto cuando el asistente no está disponible (LLM falló)", async () => {
    mockedChatWithAssistant.mockResolvedValue(null);

    const caller = appRouter.createCaller(createContext(AUTH_USER));
    const result = await caller.ai.chat({ messages: [{ role: "user", content: "hola" }] });

    expect(result).toEqual({ success: false, message: "El asistente no está disponible en este momento.", reply: null });
  });
});
