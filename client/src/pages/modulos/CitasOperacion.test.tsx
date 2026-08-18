import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

let mockModules: string[] = ["citas", "monitor"];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: mockModules, isLoading: false }),
      },
    },
  },
}));

import PreviewCitasOperacion from "./CitasOperacion";

describe("CitasOperacion", () => {
  it("shows both tabs when the user can view both sub-modules", () => {
    mockModules = ["citas", "monitor"];
    render(<PreviewCitasOperacion />);
    expect(screen.getByRole("tab", { name: /Citas/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Operación/ })).toBeInTheDocument();
  });

  it("renders Citas directly, without tab chrome, when Operación is not accessible", () => {
    mockModules = ["citas"];
    render(<PreviewCitasOperacion />);
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("Citas hoy")).toBeInTheDocument();
  });

  it("renders Operación directly, without tab chrome, when Citas is not accessible", () => {
    mockModules = ["monitor"];
    render(<PreviewCitasOperacion />);
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("Ventanillas activas")).toBeInTheDocument();
  });

  it("shows an empty state when neither sub-module is accessible", () => {
    mockModules = [];
    render(<PreviewCitasOperacion />);
    expect(screen.getByText("Tu rol no tiene permiso para ver Citas ni Operación.")).toBeInTheDocument();
  });
});
