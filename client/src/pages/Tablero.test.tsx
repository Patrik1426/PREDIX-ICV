import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import Tablero from "./Tablero";

function renderTablero() {
  const { hook } = memoryLocation({ path: "/", static: true });
  render(
    <Router hook={hook}>
      <Tablero />
    </Router>
  );
}

describe("Tablero", () => {
  it("opens with a hero stat from the proposal's executive summary (RESULTADOS_ESPERADOS), not a generic KPI", () => {
    renderTablero();
    expect(screen.getByText("-40%")).toBeInTheDocument();
    expect(screen.getByText(/en tiempo de espera/i)).toBeInTheDocument();
    expect(screen.getByText(/de 45-120 min en pico a <20 min/)).toBeInTheDocument();
  });

  it("renders the 5 blocks: indicadores de éxito, comparativo, tendencia, fuentes de datos, reporteador", () => {
    renderTablero();
    expect(screen.getByText("Indicadores de éxito — línea base vs. meta (12 meses)")).toBeInTheDocument();
    expect(screen.getByText("Comparativo por delegación")).toBeInTheDocument();
    expect(screen.getByText("Tendencia semanal")).toBeInTheDocument();
    expect(screen.getByText("Fuentes de datos")).toBeInTheDocument();
    expect(screen.getByText("Reporteador")).toBeInTheDocument();
  });

  it("renders the 5 bullet KPIs and the 2 solo-meta KPIs without a fabricated baseline", () => {
    renderTablero();
    expect(screen.getByText("Tiempo de espera")).toBeInTheDocument();
    expect(screen.getByText("120 min real · meta 20 min")).toBeInTheDocument();
    expect(screen.getByText("Satisfacción ciudadana")).toBeInTheDocument();
    expect(screen.getByText("Meta: > 4.2/5.0")).toBeInTheDocument();
    expect(screen.getByText("Precisión de predicción")).toBeInTheDocument();
    expect(screen.getByText("Meta: > 85% (MAPE < 15%)")).toBeInTheDocument();
  });

  it("shows the delegación with the highest ocupación and links to Predicción y Asignación", () => {
    renderTablero();
    expect(screen.getAllByText("Monterrey Centro").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Ver Predicción y Asignación/ })).toHaveAttribute(
      "href",
      "/modulos/prediccion_asignacion"
    );
  });

  it("marks all 6 real data sources from section 5.1 as Planeado, never Conectado", () => {
    renderTablero();
    expect(screen.getByText("Portal icvnl.gob.mx")).toBeInTheDocument();
    expect(screen.getByText("NL en Línea (nlinea.nl.gob.mx)")).toBeInTheDocument();
    expect(screen.getAllByText("Planeado")).toHaveLength(6);
    expect(screen.queryByText("Conectado")).not.toBeInTheDocument();
  });

  it("links to /propuesta", () => {
    renderTablero();
    expect(screen.getByRole("link", { name: /Ver propuesta completa/ })).toHaveAttribute("href", "/propuesta");
  });

  it("connects the statewide KPIs to delegaciones en estado saturado, without fabricating a per-delegación breakdown", () => {
    renderTablero();
    expect(screen.getByText(/Delegaciones en estado saturado/)).toBeInTheDocument();
    expect(screen.getByText(/Monterrey Centro \(86%\)/)).toBeInTheDocument();
  });

  it("renders the weekly trend as a real recharts bar chart, one bar per day of DEMO_CITAS_SEMANA", () => {
    renderTablero();
    const section = screen.getByText("Tendencia semanal").closest("section");
    expect(section).not.toBeNull();
    const scoped = within(section as HTMLElement);
    expect(section?.querySelectorAll(".recharts-bar-rectangle")).toHaveLength(6);
    expect(scoped.getByText("Lun")).toBeInTheDocument();
    expect(scoped.getByText("Sáb")).toBeInTheDocument();
  });
});
