import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PolicyStudio from "./PolicyStudio";

describe("PolicyStudio", () => {
  it("renders the honest demo-data notice and the 5 mapped sources", () => {
    render(<PolicyStudio />);
    expect(screen.getByText(/Ambiente demostrativo/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ICVNL" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "REPUVE" })).toBeInTheDocument();
    expect(screen.getByText("5 fuentes mapeadas")).toBeInTheDocument();
  });

  it("recalculates the discount simulation when the slider changes", () => {
    render(<PolicyStudio />);
    expect(screen.getByText("74%")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Porcentaje de descuento"), { target: { value: "12" } });
    expect(screen.getByText("12%")).toBeInTheDocument();
    expect(screen.getByText("87%")).toBeInTheDocument();
  });

  it("filters the evidence crossings when a segment is selected", () => {
    render(<PolicyStudio />);
    expect(screen.getAllByText(/Segmento/).length).toBeGreaterThan(1);
    fireEvent.change(screen.getByLabelText("Segmento de política"), { target: { value: "acceso" } });
    const cruces = screen.getByText("Cruces demostrativos de evidencia").closest("section") as HTMLElement;
    expect(within(cruces).getByText("Población con barreras de acceso")).toBeInTheDocument();
    expect(within(cruces).queryByText("Regularización pendiente")).not.toBeInTheDocument();
  });
});
