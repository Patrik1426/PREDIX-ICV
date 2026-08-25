import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface MockQueryResult {
  data: string[] | undefined;
  isLoading: boolean;
}

let mockQueryResult: MockQueryResult = { data: ["admin"], isLoading: false };

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      getAccessibleModules: {
        useQuery: () => mockQueryResult,
      },
    },
  },
}));

import ComponentShowcase from "./ComponentShowcase";

async function renderPage(initialResult: MockQueryResult) {
  mockQueryResult = initialResult;
  const { hook } = memoryLocation({ path: "/admin/componentes", static: true });
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
}

describe("ComponentShowcase", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("fetch not stubbed"))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders without crashing when admin has access", async () => {
    await renderPage({ data: ["admin"], isLoading: false });
    expect(screen.getByText("Shadcn/ui Component Library")).toBeInTheDocument();
  });

  it("redirects home when non-admin tries to access", async () => {
    mockQueryResult = { data: [], isLoading: false };
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
    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  it("handles loading→loaded transition for non-admin without Rules of Hooks error", async () => {
    // Start with loading: true (guard won't fire, hooks will run)
    mockQueryResult = { data: undefined, isLoading: true };
    const { hook } = memoryLocation({ path: "/admin/componentes" });
    const { rerender } = render(
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

    // While loading, should show nothing (just loading state, no content)
    // Now transition to loaded: false (guard fires for non-admin, redirect happens)
    mockQueryResult = { data: [], isLoading: false };
    rerender(
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

    // Should redirect to home without throwing "Rendered fewer hooks than expected"
    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });
});
