import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { ThemeProvider } from "@/contexts/ThemeContext";

let mockAccessibleModules: string[] = ["admin"];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => ({ data: mockAccessibleModules, isLoading: false }),
      },
    },
  },
}));

import ComponentShowcase from "./ComponentShowcase";

async function renderPage(accessibleModules: string[]) {
  mockAccessibleModules = accessibleModules;
  const { hook } = memoryLocation({ path: "/admin/componentes", static: true });
  render(
    <ThemeProvider defaultTheme="light" switchable>
      <Router hook={hook}>
        <Route path="/admin/componentes">
          <ComponentShowcase />
        </Route>
      </Router>
    </ThemeProvider>
  );
}

describe("ComponentShowcase", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("fetch not stubbed"))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders without crashing when admin has access", async () => {
    await renderPage(["admin"]);
    expect(screen.getByText("Shadcn/ui Component Library")).toBeInTheDocument();
  });

  it("redirects home when non-admin tries to access", () => {
    mockAccessibleModules = [];
    const { hook } = memoryLocation({ path: "/admin/componentes" });
    render(
      <ThemeProvider defaultTheme="light" switchable>
        <Router hook={hook}>
          <Route path="/admin/componentes">
            <ComponentShowcase />
          </Route>
          <Route path="/">
            <div>Home</div>
          </Route>
        </Router>
      </ThemeProvider>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
