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

  it("stays at the real sum (16) through the first 2 ticks — the live climb is calm, not per-tick", () => {
    render(<PreviewMonitor />);
    settleCounters();
    expect(screen.getByText("16")).toBeInTheDocument();

    // 1 tick más (2200ms) sin llegar al 3er tick todavía.
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("16")).toBeInTheDocument();
  });

  it("después de 3 ticks, una ventanilla activa suma 1 atendido más — el panel se siente vivo, no estático", () => {
    render(<PreviewMonitor />);
    settleCounters();
    expect(screen.getByText("16")).toBeInTheDocument();

    // 2 ticks más (llega a tick=3, el ritmo del incremento) + settle del
    // contador (mismo settleCounters() de siempre, no un advance(1000) a
    // secas — el cambio de target ocurre justo al final del 2do advance de
    // 2200ms, así que el useCounter recién empieza a contar desde ahí y
    // necesita su margen completo, no exactamente 1000ms al límite).
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    settleCounters();

    expect(screen.queryByText("16")).not.toBeInTheDocument();
    expect(screen.getByText("17")).toBeInTheDocument();
  });

  it("a ventanilla fuera de servicio nunca acumula atendidos en el ciclo vivo", () => {
    render(<PreviewMonitor />);
    settleCounters();

    // Saca la primera ventanilla (V4, la que el ciclo tocaría primero en tick=3).
    fireEvent.click(screen.getAllByRole("button", { name: "Marcar fuera de servicio" })[0]);
    settleCounters();
    // V4 aporta 8 -> 16 - 8 = 8 activo.
    expect(screen.getByText("8")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200);
    });
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    settleCounters();

    // Debe subir por otra ventanilla activa (no V4, que sigue fuera), nunca
    // seguir en 8 para siempre ni revivir a V4.
    expect(screen.queryByText("8")).not.toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });
});
