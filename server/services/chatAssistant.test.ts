import { describe, it, expect, vi, afterEach } from "vitest";
import { chatWithAssistant } from "./chatAssistant";
import { invokeLLM } from "../_core/ai/llm";

vi.mock("../_core/ai/llm", async () => {
  const actual = await vi.importActual<typeof import("../_core/ai/llm")>("../_core/ai/llm");
  return { ...actual, invokeLLM: vi.fn() };
});

const mockedInvokeLLM = vi.mocked(invokeLLM);

function llmResult(content: string) {
  return {
    id: "test",
    created: Date.now(),
    model: "gemini-3.1-flash-lite",
    choices: [{ index: 0, message: { role: "assistant" as const, content }, finish_reason: "stop" }],
  };
}

describe("chatWithAssistant", () => {
  afterEach(() => vi.clearAllMocks());

  it("devuelve el texto de respuesta cuando el LLM responde", async () => {
    mockedInvokeLLM.mockResolvedValue(llmResult("Puedes tramitar el refrendo en cualquier delegación."));

    const result = await chatWithAssistant([{ role: "user", content: "¿Dónde tramito el refrendo?" }]);

    expect(result).toEqual({ reply: "Puedes tramitar el refrendo en cualquier delegación.", usedTool: false });
    expect(mockedInvokeLLM).toHaveBeenCalledTimes(1);
  });

  it("manda un mensaje system con las reglas antes que el historial del usuario", async () => {
    mockedInvokeLLM.mockResolvedValue(llmResult("ok"));

    await chatWithAssistant([{ role: "user", content: "hola" }]);

    const callArgs = mockedInvokeLLM.mock.calls[0][0];
    expect(callArgs.messages[0].role).toBe("system");
    expect(callArgs.messages[0].content).toContain("Nunca inventes");
    expect(callArgs.messages[1]).toEqual({ role: "user", content: "hola" });
  });

  it("devuelve null (nunca inventa una respuesta) si el LLM falla", async () => {
    mockedInvokeLLM.mockRejectedValue(new Error("GEMINI_API_KEY no está configurada"));

    const result = await chatWithAssistant([{ role: "user", content: "hola" }]);

    expect(result).toBeNull();
  });
});
