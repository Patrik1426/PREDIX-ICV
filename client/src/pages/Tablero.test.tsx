import { render, screen } from "@testing-library/react";
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
  it("renders the 4 blocks: KPIs, fuentes de datos, reporteador and IA/predicción", () => {
    renderTablero();
    expect(screen.getByText("Indicadores generales (datos de ejemplo)")).toBeInTheDocument();
    expect(screen.getByText("Fuentes de datos")).toBeInTheDocument();
    expect(screen.getByText("Reporteador")).toBeInTheDocument();
    expect(screen.getByText("Resumen del modelo")).toBeInTheDocument();
  });

  it("shows the delegación with the highest ocupación as the AI/prediction highlight", () => {
    renderTablero();
    expect(screen.getByText("Monterrey Centro")).toBeInTheDocument();
  });

  it("marks the Gemini data source as connected and the rest as pendiente", () => {
    renderTablero();
    expect(screen.getByText("Asistente IA (Gemini)")).toBeInTheDocument();
    expect(screen.getAllByText("Pendiente")).toHaveLength(2);
  });

  it("links to /propuesta and to the Predicción y Asignación module", () => {
    renderTablero();
    expect(screen.getByRole("link", { name: /Ver propuesta completa/ })).toHaveAttribute("href", "/propuesta");
    expect(screen.getByRole("link", { name: /Ver Predicción y Asignación/ })).toHaveAttribute(
      "href",
      "/modulos/prediccion_asignacion"
    );
  });
});
