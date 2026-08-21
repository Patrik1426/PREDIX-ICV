import { render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import Tablero from "./Tablero";

async function renderTablero() {
  const { hook } = memoryLocation({ path: "/", static: true });
  render(
    <Router hook={hook}>
      <Tablero />
    </Router>
  );
  // Tablero monta el DelegacionesMap real, que hace fetch("/data/nl-municipios.geojson")
  // al montarse y, cuando resuelve/rechaza, llama setStatus fuera del render síncrono.
  // Sin esperar ese asentamiento aquí (dentro del act() implícito de waitFor), el
  // setState posterior ocurre después de que el test ya retornó, generando warnings
  // de act() en cada test aunque las aserciones sigan pasando. Con el fetch stubeado
  // para rechazar (ver beforeEach abajo), el mapa siempre termina en estado "error".
  await waitFor(() => {
    expect(screen.queryByTestId("delegaciones-map-loading")).not.toBeInTheDocument();
  });
}

describe("Tablero", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("fetch not stubbed"))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens with a hero stat from the proposal's executive summary (RESULTADOS_ESPERADOS), not a generic KPI", async () => {
    await renderTablero();
    expect(screen.getByText("-40%")).toBeInTheDocument();
    expect(screen.getByText(/en tiempo de espera/i)).toBeInTheDocument();
    expect(screen.getByText(/de 45-120 min en pico a <20 min/)).toBeInTheDocument();
  });

  it("renders the 5 blocks: indicadores de éxito, comparativo, tendencia, fuentes de datos, reporteador", async () => {
    await renderTablero();
    expect(screen.getByText("Indicadores de éxito — línea base vs. meta (12 meses)")).toBeInTheDocument();
    expect(screen.getByText("Comparativo por delegación")).toBeInTheDocument();
    expect(screen.getByText("Tendencia semanal")).toBeInTheDocument();
    expect(screen.getByText("Fuentes de datos")).toBeInTheDocument();
    expect(screen.getByText("Reporteador")).toBeInTheDocument();
  });

  it("renders the 5 bullet KPIs and the 2 solo-meta KPIs without a fabricated baseline", async () => {
    await renderTablero();
    expect(screen.getByText("Tiempo de espera")).toBeInTheDocument();
    expect(screen.getByText("120 min real · meta 20 min")).toBeInTheDocument();
    expect(screen.getByText("Satisfacción ciudadana")).toBeInTheDocument();
    expect(screen.getByText("Meta: > 4.2/5.0")).toBeInTheDocument();
    expect(screen.getByText("Precisión de predicción")).toBeInTheDocument();
    expect(screen.getByText("Meta: > 85% (MAPE < 15%)")).toBeInTheDocument();
  });

  it("shows the delegación with the highest ocupación and links to Predicción y Asignación", async () => {
    await renderTablero();
    expect(screen.getAllByText("Monterrey Centro").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Ver Predicción y Asignación/ })).toHaveAttribute(
      "href",
      "/modulos/prediccion_asignacion"
    );
  });

  it("mounts the real DelegacionesMap inside the Comparativo por delegación section", async () => {
    await renderTablero();
    const section = screen.getByText("Comparativo por delegación").closest("section");
    expect(section?.querySelector(".leaflet-container")).not.toBeNull();
  });

  it("marks all 6 real data sources from section 5.1 as Planeado, never Conectado", async () => {
    await renderTablero();
    expect(screen.getByText("Portal icvnl.gob.mx")).toBeInTheDocument();
    expect(screen.getByText("NL en Línea (nlinea.nl.gob.mx)")).toBeInTheDocument();
    expect(screen.getAllByText("Planeado")).toHaveLength(6);
    expect(screen.queryByText("Conectado")).not.toBeInTheDocument();
  });

  it("links to /propuesta", async () => {
    await renderTablero();
    expect(screen.getByRole("link", { name: /Ver propuesta completa/ })).toHaveAttribute("href", "/propuesta");
  });

  it("connects the statewide KPIs to delegaciones en estado saturado, without fabricating a per-delegación breakdown", async () => {
    await renderTablero();
    expect(screen.getByText(/Delegaciones en estado saturado/)).toBeInTheDocument();
    expect(screen.getByText(/Monterrey Centro \(86%\)/)).toBeInTheDocument();
  });

  it("renders the weekly trend as a real recharts bar chart, one bar per day of DEMO_CITAS_SEMANA", async () => {
    await renderTablero();
    const section = screen.getByText("Tendencia semanal").closest("section");
    expect(section).not.toBeNull();
    const scoped = within(section as HTMLElement);
    expect(section?.querySelectorAll(".recharts-bar-rectangle")).toHaveLength(6);
    expect(scoped.getByText("Lun")).toBeInTheDocument();
    expect(scoped.getByText("Sáb")).toBeInTheDocument();
  });

  it("uses the same quiet eyebrow style across all 6 sections, never the loud report-cover style", async () => {
    await renderTablero();
    // "Sección 8 de la propuesta" (Indicadores de éxito) used to render via SectionHeading
    // (bold, uppercase, primary-colored eyebrow) while the other 5 sections already used
    // ModuleHeader's quiet eyebrow (muted-foreground, no uppercase). This asserted they all
    // match ModuleHeader's treatment, so the page reads as one consistent dashboard.
    const eyebrows = [
      "Meta del proyecto — resumen ejecutivo",
      "Sección 8 de la propuesta",
      "Sección 6.3 — ver",
      "Sección 4 — anticipar",
      "Sección 5.1",
      "Sección 9.2 — demostrar",
    ];
    for (const text of eyebrows) {
      const el = screen.getByText(text);
      expect(el).toHaveClass("text-muted-foreground");
      expect(el).not.toHaveClass("uppercase");
      expect(el).not.toHaveClass("text-primary");
    }
  });
});
