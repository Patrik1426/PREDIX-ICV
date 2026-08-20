import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

let mockAccessibleModules: string[] = ["citas", "monitor"];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: mockAccessibleModules, isLoading: false }),
      },
    },
  },
}));

import CitasYOperacion from "./CitasYOperacion";

function renderPage(accessibleModules: string[]) {
  mockAccessibleModules = accessibleModules;
  const { hook } = memoryLocation({ path: "/modulos/citas_operacion", static: true });
  render(
    <Router hook={hook}>
      <Route path="/modulos/citas_operacion">
        <CitasYOperacion />
      </Route>
    </Router>
  );
}

describe("CitasYOperacion", () => {
  it("renders as a real top-level page — no 'vista previa'/module-numbering framing, but keeps the honest example-data badge", () => {
    renderPage(["citas", "monitor"]);
    expect(screen.getByRole("heading", { name: "Citas y Operación", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Datos de ejemplo")).toBeInTheDocument();
    expect(screen.queryByText("Vista previa interactiva")).not.toBeInTheDocument();
    expect(screen.queryByText(/Módulo 0/)).not.toBeInTheDocument();
  });

  it("renders the real tabbed Citas/Operación demo", () => {
    renderPage(["citas", "monitor"]);
    expect(screen.getByRole("tab", { name: /Citas/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Operación/ })).toBeInTheDocument();
  });

  it("keeps the 'Cómo funcionará' section with the real proposal content (ciclo de vida, metas del panel)", () => {
    renderPage(["citas", "monitor"]);
    expect(screen.getByText("Cómo funcionará")).toBeInTheDocument();
    expect(screen.getByText("Ciclo de vida de una cita")).toBeInTheDocument();
    expect(screen.getByText("Metas del panel")).toBeInTheDocument();
  });

  it("redirects home when the role has no access to either sub-module", () => {
    mockAccessibleModules = [];
    const { hook } = memoryLocation({ path: "/modulos/citas_operacion" });
    render(
      <Router hook={hook}>
        <Route path="/">redirected home</Route>
        <Route path="/modulos/citas_operacion">
          <CitasYOperacion />
        </Route>
      </Router>
    );
    expect(screen.getByText("redirected home")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Citas y Operación" })).not.toBeInTheDocument();
  });
});
