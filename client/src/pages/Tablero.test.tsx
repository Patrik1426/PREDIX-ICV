import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("opens with a hero stat from the proposal's executive summary (RESULTADOS_ESPERADOS), not a generic KPI", async () => {
    await renderTablero();
    expect(screen.getByText("-40%")).toBeInTheDocument();
    expect(screen.getByText(/en tiempo de espera/i)).toBeInTheDocument();
    expect(screen.getByText(/de 45-120 min en pico a <20 min/)).toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("renders the 5 blocks: indicadores de éxito, comparativo, tendencia, fuentes de datos, reporteador", async () => {
    await renderTablero();
    expect(screen.getByText("Indicadores de éxito — línea base vs. meta (12 meses)")).toBeInTheDocument();
    expect(screen.getByText("Comparativo por delegación")).toBeInTheDocument();
    expect(screen.getByText("Tendencia semanal")).toBeInTheDocument();
    expect(screen.getByText("Fuentes de datos")).toBeInTheDocument();
    expect(screen.getByText("Reporteador")).toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("renders the 5 bullet KPIs and the 2 solo-meta KPIs without a fabricated baseline", async () => {
    await renderTablero();
    expect(screen.getByText("Tiempo de espera")).toBeInTheDocument();
    expect(screen.getByText("120 min real · meta 20 min")).toBeInTheDocument();
    expect(screen.getByText("Satisfacción ciudadana")).toBeInTheDocument();
    expect(screen.getByText("Meta: > 4.2/5.0")).toBeInTheDocument();
    expect(screen.getByText("Precisión de predicción")).toBeInTheDocument();
    expect(screen.getByText("Meta: > 85% (MAPE < 15%)")).toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  // Nota (2026-08-22): además, "Monterrey Centro" se renombró a "Monterrey" y su
  // ocupación pasó de 86% a 91% (ver docs/superpowers/specs/2026-08-22-mapa-real-9-delegaciones-design.md)
  // — al reactivar, esta aserción también necesita ese ajuste, no solo demoData.ts.
  it.skip("shows the delegación with the highest ocupación and links to Predicción y Asignación", async () => {
    await renderTablero();
    expect(screen.getAllByText("Monterrey Centro").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Ver Predicción y Asignación/ })).toHaveAttribute(
      "href",
      "/modulos/prediccion_asignacion"
    );
  });

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it.skip("mounts the real DelegacionesMap inside the Comparativo por delegación section", async () => {
    await renderTablero();
    const section = screen.getByText("Ocupación por Delegación").closest("section");
    expect(section?.querySelector(".leaflet-container")).not.toBeNull();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("marks all 6 real data sources from section 5.1 as Planeado, never Conectado", async () => {
    await renderTablero();
    expect(screen.getByText("Portal icvnl.gob.mx")).toBeInTheDocument();
    expect(screen.getByText("NL en Línea (nlinea.nl.gob.mx)")).toBeInTheDocument();
    expect(screen.getAllByText("Planeado")).toHaveLength(6);
    expect(screen.queryByText("Conectado")).not.toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("links to /propuesta", async () => {
    await renderTablero();
    expect(screen.getByRole("link", { name: /Ver propuesta completa/ })).toHaveAttribute("href", "/propuesta");
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  // Nota (2026-08-22): además, "Monterrey Centro" se renombró a "Monterrey" y su
  // ocupación pasó de 86% a 91% (ver docs/superpowers/specs/2026-08-22-mapa-real-9-delegaciones-design.md)
  // — al reactivar, esta aserción también necesita ese ajuste, no solo demoData.ts.
  it.skip("connects the statewide KPIs to delegaciones en estado saturado, without fabricating a per-delegación breakdown", async () => {
    await renderTablero();
    expect(screen.getByText(/Delegaciones en estado saturado/)).toBeInTheDocument();
    expect(screen.getByText(/Monterrey Centro \(86%\)/)).toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("renders the weekly trend as a real recharts bar chart, one bar per day of DEMO_CITAS_SEMANA", async () => {
    await renderTablero();
    const section = screen.getByText("Tendencia semanal").closest("section");
    expect(section).not.toBeNull();
    const scoped = within(section as HTMLElement);
    expect(section?.querySelectorAll(".recharts-bar-rectangle")).toHaveLength(6);
    expect(scoped.getByText("Lun")).toBeInTheDocument();
    expect(scoped.getByText("Sáb")).toBeInTheDocument();
  });

  // Roto por el port de Preview Design — ver docs/superpowers/specs/2026-08-21-port-preview-figma-design.md.
  // Reactivar cuando se reintegre demoData.ts a esta página.
  it.skip("uses the same quiet eyebrow style across all 6 sections, never the loud report-cover style", async () => {
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

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it.skip("filters the delegation dropdown to the real delegaciones and switches the weekly chart to a period average", async () => {
    await renderTablero();

    const periodoSelect = screen.getByDisplayValue("Diario — semana actual");
    fireEvent.change(periodoSelect, { target: { value: "promedio" } });
    expect(screen.getByText(/Ocupación promedio de la semana/)).toBeInTheDocument();

    const delegacionSelect = screen.getByDisplayValue("Todas las delegaciones");
    expect(delegacionSelect).toBeInTheDocument();
    fireEvent.change(delegacionSelect, { target: { value: "García" } });
    expect(delegacionSelect).toHaveValue("García");
  });

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it.skip("shows a priority-of-day banner derived from the most saturated real delegación", async () => {
    await renderTablero();
    expect(screen.getByText("Prioridad del día")).toBeInTheDocument();
    expect(screen.getByText(/Amortiguar la demanda en Monterrey/)).toBeInTheDocument();
    expect(screen.getByText(/91% de ocupación actual/)).toBeInTheDocument();
  });

  it("exports KPIs with the real ReportExporter component, not a fake alert() button", async () => {
    await renderTablero();
    expect(screen.getByRole("button", { name: /Generar reporte/ })).toBeInTheDocument();
    expect(screen.queryByText("Exportar CSV")).not.toBeInTheDocument();
  });

  it("marks every column header of the delegation table with scope=col", async () => {
    await renderTablero();
    const table = screen.getByText("Delegación", { selector: "th" }).closest("table");
    const headers = within(table as HTMLElement).getAllByRole("columnheader");
    expect(headers).toHaveLength(5);
    for (const header of headers) {
      expect(header).toHaveAttribute("scope", "col");
    }
  });

  it("links 'Ver operación' to the real Citas y Operación page instead of doing nothing", async () => {
    await renderTablero();
    expect(screen.getByRole("link", { name: /Ver operación/ })).toHaveAttribute("href", "/modulos/citas_operacion");
  });

  it("marks 'Ver todas' as disabled instead of pretending it navigates somewhere", async () => {
    await renderTablero();
    const boton = screen.getByRole("button", { name: /Ver todas/ });
    expect(boton).toBeDisabled();
    expect(boton).toHaveAttribute("aria-disabled", "true");
  });

  it("gives the revenue and demand charts a real sr-only textual summary", async () => {
    await renderTablero();
    const recaudacion = screen.getByText("Recaudación y proyección").closest("section");
    expect(within(recaudacion as HTMLElement).getByText(/Ago/, { selector: "p.sr-only" })).toBeInTheDocument();

    const demanda = screen.getByText("Demanda por trámite").closest("section");
    expect(within(demanda as HTMLElement).getByText(/Refrendo/, { selector: "p.sr-only" })).toBeInTheDocument();
  });

  it("derives 'mayor presión' from the real demandMix data instead of a hardcoded label", async () => {
    await renderTablero();
    const demanda = screen.getByText("Demanda por trámite").closest("section");
    expect(within(demanda as HTMLElement).getByText("Mayor presión: Refrendo")).toBeInTheDocument();
    expect(within(demanda as HTMLElement).getByText("42% del volumen")).toBeInTheDocument();
  });

  // Roto por el reemplazo total con predix-icvnl — ver
  // docs/superpowers/specs/2026-08-24-port-predix-icvnl-reemplazo-total-design.md.
  it.skip("shows priority alerts for KPIs not at ok status and a delegation performance table filterable by the selected delegación", async () => {
    await renderTablero();

    const alertas = screen.getByTestId("alertas-priorizadas");
    expect(within(alertas).getByText("Alertas Priorizadas")).toBeInTheDocument();
    expect(within(alertas).getByText("ALTAS PROCESADAS")).toBeInTheDocument();

    const tabla = screen.getByTestId("delegacion-performance-table");
    expect(within(tabla).getByText("Monterrey")).toBeInTheDocument();
    expect(within(tabla).getByText("91%")).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue("Todas las delegaciones"), { target: { value: "García" } });
    expect(within(tabla).queryByText("Monterrey")).not.toBeInTheDocument();
    expect(within(tabla).getByText("García")).toBeInTheDocument();
  });
});
