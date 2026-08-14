import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrendBadge } from "./TrendBadge";

describe("TrendBadge", () => {
  it("renders 0% as neutral", () => {
    render(<TrendBadge value={0} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders positive value with a plus-free percentage", () => {
    render(<TrendBadge value={12} />);
    expect(screen.getByText("12%")).toBeInTheDocument();
  });

  it("renders negative value as absolute percentage", () => {
    render(<TrendBadge value={-8} />);
    expect(screen.getByText("8%")).toBeInTheDocument();
  });
});
