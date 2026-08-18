import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

let mockModules: string[] = ["prediccion_demanda", "asignador_ventanillas"];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: mockModules, isLoading: false }),
      },
    },
  },
}));

import PreviewPrediccionAsignacion from "./PrediccionAsignacion";

describe("PrediccionAsignacion", () => {
  it("shows both tabs when the user can view both sub-modules", () => {
    mockModules = ["prediccion_demanda", "asignador_ventanillas"];
    render(<PreviewPrediccionAsignacion />);
    expect(screen.getByRole("tab", { name: /Predicción/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Asignación/ })).toBeInTheDocument();
  });

  it("renders Predicción directly, without tab chrome, when Asignación is not accessible", () => {
    mockModules = ["prediccion_demanda"];
    render(<PreviewPrediccionAsignacion />);
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("Trámites proyectados hoy")).toBeInTheDocument();
  });

  it("renders Asignación directly, without tab chrome, when Predicción is not accessible", () => {
    mockModules = ["asignador_ventanillas"];
    render(<PreviewPrediccionAsignacion />);
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("Ventanillas activas")).toBeInTheDocument();
  });

  it("shows an empty state when neither sub-module is accessible", () => {
    mockModules = [];
    render(<PreviewPrediccionAsignacion />);
    expect(
      screen.getByText("Tu rol no tiene permiso para ver Predicción ni Asignación.")
    ).toBeInTheDocument();
  });
});
