import { render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PreviewPrediccion from "./PrediccionDemanda";

async function renderPreview() {
  render(<PreviewPrediccion />);
  // DelegacionesMap real hace fetch al montarse — mismo patrón que
  // Tablero.test.tsx, esperar a que salga de "loading" antes de asertar.
  await waitFor(() => {
    expect(screen.queryByTestId("delegaciones-map-loading")).not.toBeInTheDocument();
  });
}

describe("PrediccionDemanda", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("fetch not stubbed"))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the real delegaciones map instead of the old text-bar list", async () => {
    await renderPreview();
    expect(screen.getByText("Ocupación por delegación")).toBeInTheDocument();
    // El mapa cayó a error (fetch rechazado a propósito) — confirma que es
    // el componente real DelegacionesMap y no el CarrilFlujo viejo, que
    // nunca muestra este mensaje.
    expect(screen.getByText("No se pudo cargar el mapa de delegaciones.")).toBeInTheDocument();
  });

  it("shows the per-trámite breakdown, proportional to the aggregate demand curve", async () => {
    await renderPreview();
    expect(screen.getByText("Desglose por tipo de trámite")).toBeInTheDocument();
    expect(screen.getByText("Refrendo")).toBeInTheDocument();
    expect(screen.getByText("Licencias")).toBeInTheDocument();
    expect(screen.getByText("Altas y bajas")).toBeInTheDocument();
    expect(screen.getByText("Ponlo a tu Nombre")).toBeInTheDocument();
  });

  it("shows recessive hour-axis ticks on the main curve — no longer a chart floating with zero reference", async () => {
    await renderPreview();
    // Acotado al eje real: recharts deja un <span id="recharts_measurement_span">
    // aria-hidden oculto en el DOM (mide ancho de texto para el layout) que
    // también matchea por texto — sin acotar, "23h" da falso-positivo de
    // "múltiples elementos" aunque el eje visible esté bien.
    const eje = document.querySelector(".recharts-xAxis") as HTMLElement;
    expect(within(eje).getByText("0h")).toBeInTheDocument();
    expect(within(eje).getByText("12h")).toBeInTheDocument();
    expect(within(eje).getByText("23h")).toBeInTheDocument();
  });
});
