import { render, screen, waitFor } from "@testing-library/react";
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
});
