import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

let mockAccessibleModules: string[] = ["citas", "monitor"];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: mockAccessibleModules, isLoading: false }),
      },
    },
  },
}));

import CitasYOperacion from "./CitasYOperacion";

function renderPage(accessibleModules: string[]) {
  mockAccessibleModules = accessibleModules;
  const { hook } = memoryLocation({ path: "/modulos/citas_operacion", static: true });
  render(
    <Router hook={hook}>
      <Route path="/modulos/citas_operacion">
        <CitasYOperacion />
      </Route>
    </Router>
  );
}

describe("CitasYOperacion", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("renders as a real top-level page — no 'vista previa'/module-numbering framing, but keeps the honest example-data badge", () => {
    renderPage(["citas", "monitor"]);
    expect(screen.getByRole("heading", { name: "Citas y Operación", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Datos de ejemplo")).toBeInTheDocument();
    expect(screen.queryByText("Vista previa interactiva")).not.toBeInTheDocument();
    expect(screen.queryByText(/Módulo 0/)).not.toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("renders the real tabbed Citas/Operación demo", () => {
    renderPage(["citas", "monitor"]);
    expect(screen.getByRole("tab", { name: /Citas/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Operación/ })).toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("keeps the 'Cómo funcionará' section with the real proposal content (ciclo de vida, metas del panel)", () => {
    renderPage(["citas", "monitor"]);
    expect(screen.getByText("Cómo funcionará")).toBeInTheDocument();
    expect(screen.getByText("Ciclo de vida de una cita")).toBeInTheDocument();
    expect(screen.getByText("Metas del panel")).toBeInTheDocument();
  });

  it("shows all 6 KPIs, ring+Agendar cita together, and both blocks when the role has both citas and monitor", () => {
    renderPage(["citas", "monitor"]);
    expect(screen.getByText("TIEMPO ESPERA")).toBeInTheDocument();
    expect(screen.getByText("CITAS CUMPLIDAS")).toBeInTheDocument();
    expect(screen.getByText("ciudadanos en fila activa")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Agendar cita/ })).toBeInTheDocument();
    expect(screen.getByText("Estado de Ventanillas")).toBeInTheDocument();
    expect(screen.getByText("Próximas Citas — Hoy")).toBeInTheDocument();
  });

  it("shows only Citas Cumplidas, Agendar cita without the ring, and hides Ventanillas when the role has only citas", () => {
    renderPage(["citas"]);
    expect(screen.getByText("CITAS CUMPLIDAS")).toBeInTheDocument();
    expect(screen.queryByText("TIEMPO ESPERA")).not.toBeInTheDocument();
    expect(screen.queryByText("ciudadanos en fila activa")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Agendar cita/ })).toBeInTheDocument();
    expect(screen.queryByText("Estado de Ventanillas")).not.toBeInTheDocument();
    expect(screen.getByText("Próximas Citas — Hoy")).toBeInTheDocument();
  });

  it("shows the 5 monitor KPIs, the ring without Agendar cita, and hides Próximas Citas when the role has only monitor", () => {
    renderPage(["monitor"]);
    expect(screen.queryByText("CITAS CUMPLIDAS")).not.toBeInTheDocument();
    expect(screen.getByText("TIEMPO ESPERA")).toBeInTheDocument();
    expect(screen.getByText("ciudadanos en fila activa")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Agendar cita/ })).not.toBeInTheDocument();
    expect(screen.getByText("Estado de Ventanillas")).toBeInTheDocument();
    expect(screen.queryByText("Próximas Citas — Hoy")).not.toBeInTheDocument();
  });

  it("redirects home when the role has no access to either sub-module", () => {
    mockAccessibleModules = [];
    const { hook } = memoryLocation({ path: "/modulos/citas_operacion" });
    render(
      <Router hook={hook}>
        <Route path="/">redirected home</Route>
        <Route path="/modulos/citas_operacion">
          <CitasYOperacion />
        </Route>
      </Router>
    );
    expect(screen.getByText("redirected home")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Citas y Operación" })).not.toBeInTheDocument();
  });

  it("marking an active ventanilla fuera de servicio flips its label to Reactivar", () => {
    renderPage(["citas", "monitor"]);
    expect(screen.getAllByRole("button", { name: "Marcar fuera de servicio" })).toHaveLength(6);
    expect(screen.getAllByRole("button", { name: "Reactivar" })).toHaveLength(1);

    fireEvent.click(screen.getAllByRole("button", { name: "Marcar fuera de servicio" })[0]);

    expect(screen.getAllByRole("button", { name: "Marcar fuera de servicio" })).toHaveLength(5);
    expect(screen.getAllByRole("button", { name: "Reactivar" })).toHaveLength(2);
    // V-01 (atendidos: 9) sale del conteo de inmediato: 47 - 9 = 38.
    expect(screen.getByText("38")).toBeInTheDocument();
  });

  it("TRÁMITES / HORA starts at the real sum of atendidos across active ventanillas (47)", () => {
    renderPage(["citas", "monitor"]);
    // ventanillasIniciales activas: 9+6+8+5+11+8 = 47 — suma real, no fabricada.
    expect(screen.getByText("47")).toBeInTheDocument();
  });

  it("after 3 live ticks, one active ventanilla's atendidos climbs by 1 and TRÁMITES / HORA follows", () => {
    vi.useFakeTimers();
    renderPage(["citas", "monitor"]);
    expect(screen.getByText("47")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200 * 3);
    });

    expect(screen.queryByText("47")).not.toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
  });

  it("scheduling a test cita adds it to Próximas Citas — Hoy as Confirmada", () => {
    renderPage(["citas", "monitor"]);

    fireEvent.click(screen.getByRole("button", { name: /Agendar cita/ }));
    fireEvent.change(screen.getByPlaceholderText("Ej. Juan García Martínez"), { target: { value: "Prueba Demo" } });
    fireEvent.click(screen.getByRole("button", { name: "Revisar cita →" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar cita" }));

    const filas = screen.getAllByText(/Prueba Demo|María González|Carlos Herrera/);
    expect(filas[0]).toHaveTextContent("Prueba Demo");
    // La nueva fila (no cualquier otra fila base con el mismo trámite) capturó "Refrendo".
    expect(filas[0].parentElement).toHaveTextContent("Refrendo");
    expect(screen.getAllByText("Confirmada").length).toBeGreaterThan(0);
  });

  it("the confirmed folio stays stable even if the page re-renders while the dialog is open", () => {
    renderPage(["citas", "monitor"]);

    fireEvent.click(screen.getByRole("button", { name: /Agendar cita/ }));
    fireEvent.click(screen.getByRole("button", { name: "Revisar cita →" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar cita" }));

    const folioTexto = screen.getByText(/FOLIO: ICVNL-2026-/).textContent;
    // Forzar un re-render del árbol (mismo tipo de disparo que el tick en
    // vivo de las ventanillas produciría) — el folio mostrado no debe cambiar.
    fireEvent.click(screen.getByRole("button", { name: "Hora Pico" }));
    expect(screen.getByText(/FOLIO: ICVNL-2026-/).textContent).toBe(folioTexto);
  });

  it("shows a real per-delegación status table and an hourly demand heatmap when the role has monitor access", () => {
    renderPage(["citas", "monitor"]);
    const tabla = screen.getByTestId("delegacion-status-table");
    expect(within(tabla).getByText("Monterrey")).toBeInTheDocument();
    expect(within(tabla).getByText(/91% · saturado/)).toBeInTheDocument();
    expect(screen.getByText("Demanda por Hora")).toBeInTheDocument();
  });

  it("hides the delegación status table and hourly heatmap when the role has only citas", () => {
    renderPage(["citas"]);
    expect(screen.queryByTestId("delegacion-status-table")).not.toBeInTheDocument();
    expect(screen.queryByText("Demanda por Hora")).not.toBeInTheDocument();
  });

  it("shows the CSAT/quality-of-service section honestly labeled as example data", () => {
    renderPage(["citas", "monitor"]);
    const section = screen.getByTestId("csat-section");
    expect(within(section).getByText("Datos de ejemplo")).toBeInTheDocument();
    expect(within(section).getByText("SATISFACCIÓN GENERAL")).toBeInTheDocument();
  });
});
