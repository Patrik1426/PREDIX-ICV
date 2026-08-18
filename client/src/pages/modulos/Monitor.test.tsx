import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PreviewMonitor from "./Monitor";

describe("Monitor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the real-data KPIs from section 3.4 of the proposal beyond the original 2", () => {
    render(<PreviewMonitor />);
    // Dos pasos: el primero pasa el flip de "loading" (600ms) y deja que React
    // monte/registre los efectos de las KpiCard nuevas; el segundo les da
    // tiempo a sus contadores (useCounter, 1000ms) para llegar a su valor
    // final. Un solo advanceTimersByTime(2000) no alcanza a registrar el
    // interval de una KpiCard que recién se monta a mitad del avance.
    act(() => {
      vi.advanceTimersByTime(700);
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText("Tiempo de espera")).toBeInTheDocument();
    expect(screen.getByText("Trámites hoy")).toBeInTheDocument();
    expect(screen.getByText("Tiempo de atención")).toBeInTheDocument();
    expect(screen.getByText("Trámites completados/hora")).toBeInTheDocument();
    expect(screen.getByText("Ocupación de ventanillas")).toBeInTheDocument();
  });

  it("computes trámites completados/hora as the real sum of atendidos across active ventanillas", () => {
    render(<PreviewMonitor />);
    // Dos pasos: el primero pasa el flip de "loading" (600ms) y deja que React
    // monte/registre los efectos de las KpiCard nuevas; el segundo les da
    // tiempo a sus contadores (useCounter, 1000ms) para llegar a su valor
    // final. Un solo advanceTimersByTime(2000) no alcanza a registrar el
    // interval de una KpiCard que recién se monta a mitad del avance.
    act(() => {
      vi.advanceTimersByTime(700);
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    // DEMO_VENTANILLAS_MONITOR: 8 + 5 + 3 = 16 — suma real, no fabricada
    expect(screen.getByText("16")).toBeInTheDocument();
  });
});
