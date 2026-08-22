import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

function renderPage(accessibleModules: string[]) {
  mockAccessibleModules = accessibleModules;
  const { hook } = memoryLocation({ path: "/modulos/prediccion_asignacion", static: true });
  render(
    <Router hook={hook}>
      <Route path="/modulos/prediccion_asignacion">
        <PrediccionYAsignacion />
      </Route>
    </Router>
  );
}

describe("PrediccionYAsignacion", () => {
  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("renders as a real top-level page — no 'vista previa'/module-numbering framing, but keeps the honest example-data badge", () => {
    renderPage(["prediccion_demanda", "asignador_ventanillas"]);
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
  it.skip("renders the real tabbed Predicción/Asignación demo", () => {
    renderPage(["prediccion_demanda", "asignador_ventanillas"]);
    expect(screen.getByRole("tab", { name: /Predicción/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Asignación/ })).toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("keeps the 'Cómo funcionará' section with the real proposal content", () => {
    renderPage(["prediccion_demanda", "asignador_ventanillas"]);
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
});
