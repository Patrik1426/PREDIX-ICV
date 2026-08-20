import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

let mockMutate: ReturnType<typeof vi.fn>;
let mockIsPending = false;

vi.mock("@/lib/trpc", () => ({
  trpc: {
    ai: {
      chat: {
        useMutation: () => ({ mutate: mockMutate, isPending: mockIsPending }),
      },
    },
  },
}));

import PreviewChatbot from "./Chatbot";

describe("Chatbot", () => {
  beforeEach(() => {
    mockMutate = vi.fn();
    mockIsPending = false;
  });

  it("shows a real greeting, no scripted quick-reply buttons", () => {
    render(<PreviewChatbot />);
    expect(screen.getByText(/asistente virtual del ICVNL/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /requisitos|espera|cita/i })).not.toBeInTheDocument();
  });

  it("sends free-text input via trpc.ai.chat and appends the real reply on success", async () => {
    mockMutate = vi.fn((_input, opts) => {
      opts.onSuccess({ success: true, message: "Respuesta generada", reply: "Puedes tramitar el refrendo en cualquier delegación." });
    });

    render(<PreviewChatbot />);
    fireEvent.change(screen.getByLabelText("Mensaje para el asistente"), { target: { value: "¿Dónde tramito el refrendo?" } });
    fireEvent.click(screen.getByLabelText("Enviar"));

    expect(mockMutate).toHaveBeenCalledWith(
      { messages: expect.arrayContaining([{ role: "user", content: "¿Dónde tramito el refrendo?" }]) },
      expect.anything()
    );
    await waitFor(() =>
      expect(screen.getByText("Puedes tramitar el refrendo en cualquier delegación.")).toBeInTheDocument()
    );
  });

  it("shows the honest unavailable message instead of a fake reply when success:false", async () => {
    mockMutate = vi.fn((_input, opts) => {
      opts.onSuccess({ success: false, message: "El asistente no está disponible en este momento.", reply: null });
    });

    render(<PreviewChatbot />);
    fireEvent.change(screen.getByLabelText("Mensaje para el asistente"), { target: { value: "hola" } });
    fireEvent.click(screen.getByLabelText("Enviar"));

    await waitFor(() =>
      expect(screen.getByText("El asistente no está disponible en este momento.")).toBeInTheDocument()
    );
  });

  it("distinguishes FORBIDDEN from a generic connection error", async () => {
    const { TRPCClientError } = await import("@trpc/client");
    mockMutate = vi.fn((_input, opts) => {
      const err = new TRPCClientError("forbidden");
      Object.assign(err, { data: { code: "FORBIDDEN" } });
      opts.onError(err);
    });

    render(<PreviewChatbot />);
    fireEvent.change(screen.getByLabelText("Mensaje para el asistente"), { target: { value: "hola" } });
    fireEvent.click(screen.getByLabelText("Enviar"));

    await waitFor(() =>
      expect(screen.getByText("Tu rol no tiene permiso para usar el asistente.")).toBeInTheDocument()
    );
  });
});
