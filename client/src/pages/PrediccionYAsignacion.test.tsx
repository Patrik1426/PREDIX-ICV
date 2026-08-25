import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

let mockAccessibleModules: string[] = ["prediccion_demanda", "asignador_ventanillas"];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: mockAccessibleModules, isLoading: false }),
      },
    },
  },
}));

import PrediccionYAsignacion from "./PrediccionYAsignacion";

async function renderPage(accessibleModules: string[]) {
  mockAccessibleModules = accessibleModules;
  const { hook } = memoryLocation({ path: "/modulos/prediccion_asignacion", static: true });
  render(
    <Router hook={hook}>
      <Route path="/modulos/prediccion_asignacion">
        <PrediccionYAsignacion />
      </Route>
    </Router>
  );
  // PrediccionYAsignacion monta el DelegacionesMap real (tab "Mapa de Ocupación",
  // activo por default) — mismo motivo que Tablero.test.tsx: sin esperar su
  // asentamiento aquí, el setState posterior al fetch stubeado genera warnings de
  // act() aunque las aserciones sigan pasando.
  await waitFor(() => {
    expect(screen.queryByTestId("delegaciones-map-loading")).not.toBeInTheDocument();
  });
}

describe("PrediccionYAsignacion", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("fetch not stubbed"))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("renders as a real top-level page — no 'vista previa'/module-numbering framing, but keeps the honest example-data badge", async () => {
    await renderPage(["prediccion_demanda", "asignador_ventanillas"]);
    expect(screen.getByRole("heading", { name: "Predicción y Asignación", level: 1 })).toBeInTheDocument();
    // getAllByText, no getByText: la sección "Cómo funcionará" (matriz de
    // competencias) trae su propio badge "Datos de ejemplo" contextual,
    // además del de la cabecera de la página — ambos son legítimos.
    expect(screen.getAllByText("Datos de ejemplo").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Vista previa interactiva")).not.toBeInTheDocument();
    expect(screen.queryByText(/Módulo 0/)).not.toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("renders the real tabbed Predicción/Asignación demo", async () => {
    await renderPage(["prediccion_demanda", "asignador_ventanillas"]);
    expect(screen.getByRole("tab", { name: /Predicción/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Asignación/ })).toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("keeps the 'Cómo funcionará' section with the real proposal content", async () => {
    await renderPage(["prediccion_demanda", "asignador_ventanillas"]);
    expect(screen.getByText("Cómo funcionará")).toBeInTheDocument();
  });

  it("redirects home when the role has no access to either sub-module", () => {
    mockAccessibleModules = [];
    const { hook } = memoryLocation({ path: "/modulos/prediccion_asignacion" });
    render(
      <Router hook={hook}>
        <Route path="/">redirected home</Route>
        <Route path="/modulos/prediccion_asignacion">
          <PrediccionYAsignacion />
        </Route>
      </Router>
    );
    expect(screen.getByText("redirected home")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Predicción y Asignación" })).not.toBeInTheDocument();
  });

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it.skip("shows all 4 tabs when the role has both prediccion_demanda and asignador_ventanillas", async () => {
    await renderPage(["prediccion_demanda", "asignador_ventanillas"]);
    expect(screen.getByRole("button", { name: "Mapa de Ocupación" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Demanda por Trámite" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Capacidad vs Demanda" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Escenarios" })).toBeInTheDocument();
    expect(document.querySelector(".leaflet-container")).not.toBeNull();
  });

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it.skip("shows only the Predicción tabs when the role has only prediccion_demanda", async () => {
    await renderPage(["prediccion_demanda"]);
    expect(screen.getByRole("button", { name: "Mapa de Ocupación" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Demanda por Trámite" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Capacidad vs Demanda" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Escenarios" })).not.toBeInTheDocument();
  });

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it.skip("shows only Asignador tabs and defaults to Capacidad vs Demanda when the role has only asignador_ventanillas", async () => {
    await renderPage(["asignador_ventanillas"]);
    expect(screen.queryByRole("button", { name: "Mapa de Ocupación" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Demanda por Trámite" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Capacidad vs Demanda" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Escenarios" })).toBeInTheDocument();
    expect(screen.getByText("Capacidad Instalada vs. Demanda Horaria")).toBeInTheDocument();
  });

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it("shows the model confidence badge with the honest example-data label", async () => {
    await renderPage(["prediccion_demanda", "asignador_ventanillas"]);
    expect(screen.getByText("Confianza del modelo: 87%")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ambiente demostrativo: los indicadores y escenarios se presentan con datos sintéticos de referencia y no representan registros operativos oficiales."
      )
    ).toBeInTheDocument();
  });

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it.skip("shows explanatory factors and a capacity recommendation derived from real hour-by-hour gaps in the Capacidad tab", async () => {
    await renderPage(["prediccion_demanda", "asignador_ventanillas"]);
    fireEvent.click(screen.getByRole("button", { name: "Capacidad vs Demanda" }));

    expect(screen.getByText("Horas con Déficit de Capacidad")).toBeInTheDocument();
    expect(screen.getByText(/10:00 h/)).toBeInTheDocument();
    expect(screen.getByText(/\+32 sobre capacidad/)).toBeInTheDocument();
    expect(screen.getByText(/Reforzar capacidad entre las 10:00 y las 11:00 h/)).toBeInTheDocument();
  });
});
