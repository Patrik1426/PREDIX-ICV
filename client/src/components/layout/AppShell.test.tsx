import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: { name: "Ana Torres" }, logout: vi.fn() }),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getUserProfile: {
        useQuery: () => ({ data: { name: "Ana Torres", institutionalRole: "admin" as const } }),
      },
      getAccessibleModules: {
        useQuery: () => ({ data: ["chatbot"], isLoading: false }),
      },
    },
  },
}));

import { AppShell } from "./AppShell";

function renderShell() {
  const { hook } = memoryLocation({ path: "/", static: true });
  render(
    <Router hook={hook}>
      <AppShell>
        <div>contenido</div>
      </AppShell>
    </Router>
  );
}

describe("AppShell", () => {
  it("shows a sticky institutional header on desktop with an active-session badge", () => {
    renderShell();
    expect(screen.getByText("Instituto de Control Vehicular de Nuevo León")).toBeInTheDocument();
    expect(screen.getByText("Sesión institucional activa")).toBeInTheDocument();
    expect(screen.getByText("Entorno restringido")).toBeInTheDocument();
  });
});
