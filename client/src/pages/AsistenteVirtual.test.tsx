import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

let mockAccessibleModules: string[] = ["chatbot"];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: mockAccessibleModules, isLoading: false }),
      },
    },
    ai: {
      chat: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
    },
  },
}));

import AsistenteVirtual from "./AsistenteVirtual";

function renderPage(accessibleModules: string[]) {
  mockAccessibleModules = accessibleModules;
  const { hook } = memoryLocation({ path: "/modulos/chatbot", static: true });
  render(
    <Router hook={hook}>
      <Route path="/modulos/chatbot">
        <AsistenteVirtual />
      </Route>
      <Route path="/">redirected home</Route>
    </Router>
  );
}

describe("AsistenteVirtual", () => {
  it("renders as a real top-level page — no 'vista previa' framing, no module numbering", () => {
    renderPage(["chatbot"]);
    expect(screen.getByRole("heading", { name: "Asistente Virtual", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("LLM real · Gemini")).toBeInTheDocument();
    expect(screen.queryByText("Vista previa interactiva")).not.toBeInTheDocument();
    expect(screen.queryByText(/Módulo 0/)).not.toBeInTheDocument();
  });

  it("renders the real chat", () => {
    renderPage(["chatbot"]);
    expect(screen.getByLabelText("Mensaje para el asistente")).toBeInTheDocument();
  });

  it("redirects home when the role has no access to chatbot", () => {
    mockAccessibleModules = [];
    const { hook } = memoryLocation({ path: "/modulos/chatbot" });
    render(
      <Router hook={hook}>
        <Route path="/">redirected home</Route>
        <Route path="/modulos/chatbot">
          <AsistenteVirtual />
        </Route>
      </Router>
    );
    expect(screen.getByText("redirected home")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Asistente Virtual" })).not.toBeInTheDocument();
  });
});
