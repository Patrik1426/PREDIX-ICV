// client/src/pages/ModuloDetalle.test.tsx
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

let mockAccessibleModules: string[] = ["monitor"];

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

import ModuloDetalle from "./ModuloDetalle";

function renderModulo(slug: string, accessibleModules: string[]) {
  mockAccessibleModules = accessibleModules;
  const { hook } = memoryLocation({ path: `/modulos/${slug}`, static: true });
  render(
    <Router hook={hook}>
      <Route path="/modulos/:slug">
        <ModuloDetalle />
      </Route>
    </Router>
  );
  act(() => {
    vi.advanceTimersByTime(2000);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ModuloDetalle — Predicción y Asignación", () => {
  it("renders the fused view when the user has both real sub-modules", () => {
    renderModulo("prediccion_asignacion", ["prediccion_demanda", "asignador_ventanillas"]);
    expect(screen.getByRole("tab", { name: /Predicción/ })).toBeInTheDocument();
    expect(screen.getByText("Precisión del modelo")).toBeInTheDocument();
  });

  it("stays on the page (no redirect) when the user has only one of the two real sub-modules", () => {
    renderModulo("prediccion_asignacion", ["asignador_ventanillas"]);
    expect(screen.getByText("Ventanillas activas")).toBeInTheDocument();
  });
});

describe("ModuloDetalle — Citas y Operación", () => {
  it("renders the fused view when the user has both real sub-modules", () => {
    renderModulo("citas_operacion", ["citas", "monitor"]);
    expect(screen.getByRole("tab", { name: /Citas/ })).toBeInTheDocument();
    expect(screen.getByText("Próximas atenciones")).toBeInTheDocument();
  });
});

describe("ModuloDetalle — Asistente Virtual", () => {
  it("renders the real chat input and the LLM-real badge, not the old demo KPIs", () => {
    renderModulo("chatbot", ["chatbot"]);
    expect(screen.getByLabelText("Mensaje para el asistente")).toBeInTheDocument();
    expect(screen.getByText("LLM real · Gemini")).toBeInTheDocument();
    expect(screen.queryByText("Consultas resueltas hoy")).not.toBeInTheDocument();
  });
});

describe("ModuloDetalle — access gate", () => {
  it("redirects home when the user has none of the real sub-modules for the fused slug", () => {
    const { hook } = memoryLocation({ path: "/modulos/prediccion_asignacion" });
    mockAccessibleModules = ["chatbot"];
    render(
      <Router hook={hook}>
        <Route path="/">
          <p>Tablero (redirigido)</p>
        </Route>
        <Route path="/modulos/:slug">
          <ModuloDetalle />
        </Route>
      </Router>
    );
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Tablero (redirigido)")).toBeInTheDocument();
  });
});
