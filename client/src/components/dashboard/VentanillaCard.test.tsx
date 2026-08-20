import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

  it("shows no action button when onToggleServicio is not provided", () => {
    render(
      <VentanillaCard ventanilla="V4" operador="Juan P." tramite="Refrendo" tiempoMin={12} atendidos={8} estado="fluido" />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("offers 'Marcar fuera de servicio' when active, and calls onToggleServicio on click", () => {
    const onToggleServicio = vi.fn();
    render(
      <VentanillaCard
        ventanilla="V4"
        operador="Juan P."
        tramite="Refrendo"
        tiempoMin={12}
        atendidos={8}
        estado="fluido"
        onToggleServicio={onToggleServicio}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Marcar fuera de servicio" }));
    expect(onToggleServicio).toHaveBeenCalledTimes(1);
  });

  it("shows 'Reactivar' and the fuera_servicio label when estado is fuera_servicio", () => {
    render(
      <VentanillaCard
        ventanilla="V4"
        operador="Juan P."
        tramite="Refrendo"
        tiempoMin={12}
        atendidos={8}
        estado="fuera_servicio"
        onToggleServicio={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Reactivar" })).toBeInTheDocument();
    expect(screen.getByText("Fuera de servicio")).toBeInTheDocument();
  });
});
