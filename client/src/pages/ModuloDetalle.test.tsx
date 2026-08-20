// client/src/pages/ModuloDetalle.test.tsx
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

let mockAccessibleModules: string[] = ["monitor"];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: mockAccessibleModules, isLoading: false }),
      },
    },
  },
}));

import ModuloDetalle from "./ModuloDetalle";

function renderModulo(slug: string, accessibleModules: string[]) {
  mockAccessibleModules = accessibleModules;
  const { hook } = memoryLocation({ path: `/modulos/${slug}`, static: true });
  render(
    <Router hook={hook}>
      <Route path="/modulos/:slug">
        <ModuloDetalle />
      </Route>
    </Router>
  );
  act(() => {
    vi.advanceTimersByTime(2000);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Los 3 slugs con preview propio (chatbot, citas_operacion,
// prediccion_asignacion) ya se graduaron a página real — App.tsx los
// intercepta antes de llegar aquí (ver PrediccionYAsignacion.test.tsx,
// CitasYOperacion.test.tsx, AsistenteVirtual.test.tsx para su cobertura
// real). Lo único que sigue vivo en ModuloDetalle es "admin" — sin pantalla
// propia todavía, cae en el fallback genérico.
describe("ModuloDetalle — admin (único slug que sigue usando este shell)", () => {
  it("falls back to 'Sin vista previa disponible todavía' — no MODULE_PREVIEWS entry for admin", () => {
    renderModulo("admin", ["admin"]);
    expect(screen.getByText("Sin vista previa disponible todavía.")).toBeInTheDocument();
  });
});

describe("ModuloDetalle — access gate", () => {
  it("redirects home when the role doesn't have access to the slug", () => {
    const { hook } = memoryLocation({ path: "/modulos/admin" });
    mockAccessibleModules = ["chatbot"];
    render(
      <Router hook={hook}>
        <Route path="/">
          <p>Tablero (redirigido)</p>
        </Route>
        <Route path="/modulos/:slug">
          <ModuloDetalle />
        </Route>
      </Router>
    );
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Tablero (redirigido)")).toBeInTheDocument();
  });
});
