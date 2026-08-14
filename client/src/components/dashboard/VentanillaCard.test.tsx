import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VentanillaCard } from "./VentanillaCard";

describe("VentanillaCard", () => {
  it("renders ventanilla id, operador, tramite and metrics", () => {
    render(
      <VentanillaCard
        ventanilla="V4"
        operador="Juan P."
        tramite="Renovación de Licencias"
        tiempoMin={12}
        atendidos={8}
        estado="fluido"
      />
    );
    expect(screen.getByText("V4")).toBeInTheDocument();
    expect(screen.getByText("Juan P.")).toBeInTheDocument();
    expect(screen.getByText("Renovación de Licencias")).toBeInTheDocument();
    expect(screen.getByText("12 min")).toBeInTheDocument();
    expect(screen.getByText("8 atendidos")).toBeInTheDocument();
  });

  it("applies the saturado border color when estado is saturado", () => {
    const { container } = render(
      <VentanillaCard ventanilla="V2" operador="Ana R." tramite="Refrendo" tiempoMin={30} atendidos={3} estado="saturado" />
    );
    expect(container.querySelector(".border-l-status-saturado")).not.toBeNull();
  });
});
