import { act, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PreviewMonitor from "./Monitor";

function settleCounters() {
  act(() => {
    vi.advanceTimersByTime(700);
  });
  act(() => {
    vi.advanceTimersByTime(1500);
  });
}

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

  it("marking a ventanilla fuera de servicio excludes it from trámites completados/hora", () => {
    render(<PreviewMonitor />);
    settleCounters();
    expect(screen.getByText("16")).toBeInTheDocument();

    // V2 aporta 5 atendidos (ver DEMO_VENTANILLAS_MONITOR) — al sacarla de
    // servicio, el KPI debe bajar a 16 - 5 = 11, nunca seguir fingiendo 16.
    fireEvent.click(screen.getAllByRole("button", { name: "Marcar fuera de servicio" })[0]);
    settleCounters();

    expect(screen.queryByText("16")).not.toBeInTheDocument();
  });

  it("switching to a load scenario updates the ring's centerValue (esperando) instantly", () => {
    render(<PreviewMonitor />);
    settleCounters();
    // Escenario inicial "Demanda normal" — DEMO_ESCENARIOS_MONITOR[0].esperando
    expect(screen.getByText("24")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hora pico" }));

    // DEMO_ESCENARIOS_MONITOR.hora_pico.esperando — sin animación, centerValue
    // de StatusRing es texto plano, no pasa por useCounter.
    expect(screen.getByText("61")).toBeInTheDocument();
  });
});
