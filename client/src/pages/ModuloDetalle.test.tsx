import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

let mockAccessibleSlug = "monitor";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: [mockAccessibleSlug], isLoading: false }),
      },
    },
  },
}));

import ModuloDetalle from "./ModuloDetalle";

describe("ModuloDetalle — Monitor de Operaciones preview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the status ring, KPI cards and ventanilla cards", () => {
    const { hook } = memoryLocation({ path: "/modulos/monitor", static: true });
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
    expect(screen.getByText("ESPERANDO")).toBeInTheDocument();
    expect(screen.getByText("Juan P.")).toBeInTheDocument();
    expect(screen.getByText("Ana R.")).toBeInTheDocument();
    expect(screen.getByText("Marta G.")).toBeInTheDocument();
  });

  it("does not show the 'Próximamente' badge or the preview/plan tabs", () => {
    const { hook } = memoryLocation({ path: "/modulos/monitor", static: true });
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
    expect(screen.queryByText("Próximamente")).not.toBeInTheDocument();
    expect(screen.queryByText("Vista previa")).not.toBeInTheDocument();
    expect(screen.getByText("Detalle técnico")).toBeInTheDocument();
  });
});

function renderModulo(slug: string) {
  mockAccessibleSlug = slug;
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

describe("ModuloDetalle — Predicción de Demanda preview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the KPI header", () => {
    renderModulo("prediccion_demanda");
    expect(screen.getByText("Trámites proyectados hoy")).toBeInTheDocument();
    expect(screen.getByText("Precisión del modelo")).toBeInTheDocument();
    expect(screen.getByText("91")).toBeInTheDocument();
  });
});

describe("ModuloDetalle — Asignador de Ventanillas preview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the KPI header", () => {
    renderModulo("asignador_ventanillas");
    expect(screen.getByText("Ventanillas activas")).toBeInTheDocument();
    expect(screen.getByText("Tiempo de espera actual")).toBeInTheDocument();
  });
});

describe("ModuloDetalle — Citas preview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the KPI header and próximas atenciones list", () => {
    renderModulo("citas");
    expect(screen.getByText("Citas hoy")).toBeInTheDocument();
    expect(screen.getByText("En espera")).toBeInTheDocument();
    expect(screen.getByText("Próximas atenciones")).toBeInTheDocument();
    expect(screen.getByText("Martínez, Ana Paula — Trámite General")).toBeInTheDocument();
  });
});

describe("ModuloDetalle — Asistente Virtual preview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the KPI header", () => {
    renderModulo("chatbot");
    expect(screen.getByText("Consultas resueltas hoy")).toBeInTheDocument();
    expect(screen.getByText("Tiempo de respuesta")).toBeInTheDocument();
  });
});
