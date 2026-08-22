import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DelegacionesMap from "./DelegacionesMap";

const FAKE_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { cveMuni: "19039", nombre: "Monterrey" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-100.31, 25.67], [-100.30, 25.67], [-100.30, 25.68], [-100.31, 25.68], [-100.31, 25.67]]],
      },
    },
    {
      type: "Feature",
      properties: { cveMuni: "19019", nombre: "San Pedro Garza García" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-100.25, 25.67], [-100.24, 25.67], [-100.24, 25.68], [-100.25, 25.68], [-100.25, 25.67]]],
      },
    },
  ],
};

describe("DelegacionesMap", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => FAKE_GEOJSON })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders one interactive polygon per matched municipio, colored by su estado demo real", async () => {
    const { container } = render(<DelegacionesMap />);
    await waitFor(() => {
      expect(container.querySelectorAll(".leaflet-interactive")).toHaveLength(2);
    });
    const paths = Array.from(container.querySelectorAll(".leaflet-interactive"));
    // Monterrey es "saturado" en DEMO_DELEGACIONES real.
    expect(paths.some((p) => p.getAttribute("fill") === "var(--destructive)")).toBe(true);
    // San Pedro GG (-> "San Pedro Garza García") es "fluido" en DEMO_DELEGACIONES real.
    expect(paths.some((p) => p.getAttribute("fill") === "var(--success)")).toBe(true);
  });

  it("shows a loading skeleton before the geojson resolves, then removes it", async () => {
    const { container } = render(<DelegacionesMap />);
    expect(screen.getByTestId("delegaciones-map-loading")).toBeInTheDocument();
    await waitFor(() => {
      expect(container.querySelectorAll(".leaflet-interactive")).toHaveLength(2);
    });
    expect(screen.queryByTestId("delegaciones-map-loading")).not.toBeInTheDocument();
  });

  it("shows an honest error message if the geojson fetch fails, never a blank map", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<DelegacionesMap />);
    await waitFor(() => {
      expect(screen.getByText("No se pudo cargar el mapa de delegaciones.")).toBeInTheDocument();
    });
  });
});
