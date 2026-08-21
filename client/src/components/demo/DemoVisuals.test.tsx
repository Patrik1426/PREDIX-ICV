import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BulletKpi } from "./DemoVisuals";

describe("BulletKpi", () => {
  it("marks a KPI that already meets its meta in green (success), not amber", () => {
    render(<BulletKpi label="Ejemplo cumplido" actual={10} meta={20} max={40} unidad=" min" menorEsMejor />);
    const bar = screen.getByTestId("bullet-kpi-bar");
    expect(bar).toHaveClass("bg-success");
  });

  it("marks a KPI with a small gap to its meta in amber, not red", () => {
    // Eficiencia de ventanillas real: 60 vs meta 80 -> gap 25%
    render(<BulletKpi label="Eficiencia de ventanillas" actual={60} meta={80} max={100} unidad="%" menorEsMejor={false} />);
    const bar = screen.getByTestId("bullet-kpi-bar");
    expect(bar).toHaveClass("bg-chart-2");
  });

  it("marks a KPI with a large gap to its meta in red (destructive), not amber", () => {
    // Trámites con cita previa real: 5 vs meta 40 -> gap 87.5%
    render(<BulletKpi label="Trámites con cita previa" actual={5} meta={40} max={60} unidad="%" menorEsMejor={false} />);
    const bar = screen.getByTestId("bullet-kpi-bar");
    expect(bar).toHaveClass("bg-destructive");
  });
});
