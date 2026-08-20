import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PreviewAsignador from "./AsignadorVentanillas";

describe("AsignadorVentanillas", () => {
  it("shows capacidad vs. demanda por hora as a real chart", () => {
    render(<PreviewAsignador />);
    expect(screen.getByText("Capacidad vs. demanda por hora")).toBeInTheDocument();
  });

  it("shows a side-by-side comparison table of all 3 scenarios, not just the selected one", () => {
    render(<PreviewAsignador />);
    const tabla = screen.getByRole("table", { name: /Comparativo de escenarios/ });
    // Los 3 escenarios como columnas, visibles a la vez, no uno por uno.
    expect(within(tabla).getByText("Estado actual")).toBeInTheDocument();
    expect(within(tabla).getByText(/Fila de refrendos/)).toBeInTheDocument();
    expect(within(tabla).getByText(/Ventanilla ociosa/)).toBeInTheDocument();
    // Las 5 ventanillas como filas.
    expect(within(tabla).getByText("V1")).toBeInTheDocument();
    expect(within(tabla).getByText("V5")).toBeInTheDocument();
  });
});
