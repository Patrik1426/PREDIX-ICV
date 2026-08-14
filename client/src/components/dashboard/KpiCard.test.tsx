import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Activity } from "lucide-react";
import { KpiCard } from "./KpiCard";

describe("KpiCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders label, value and suffix", () => {
    render(
      <KpiCard
        icon={<Activity data-testid="icon" />}
        label="Tiempo de espera"
        value={18}
        suffix=" min"
        colorClassName="text-primary"
        spark={[10, 12, 9, 18]}
        delta={<span>+5%</span>}
      />
    );
    // useCounter animates 0 -> value over 1000ms in 16ms steps; advance well past that.
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Tiempo de espera")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("min")).toBeInTheDocument();
    expect(screen.getByText("+5%")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders without a spark line when values.length < 2", () => {
    render(
      <KpiCard
        icon={<Activity />}
        label="Solo"
        value={5}
        colorClassName="text-primary"
        spark={[5]}
        delta={null}
      />
    );
    expect(screen.getByText("Solo")).toBeInTheDocument();
  });
});
