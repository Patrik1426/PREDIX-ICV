import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PreviewCitas from "./Citas";

describe("Citas", () => {
  it("renders the weekly bars as direct children of the fixed-height row (regression: a percentage height needs a sized parent, not an auto-height flex-col wrapper)", () => {
    render(<PreviewCitas />);
    const bars = screen.getAllByTestId(/^citas-semana-barra-/);
    expect(bars).toHaveLength(6);
    bars.forEach((bar) => {
      expect(bar.parentElement).toHaveClass("h-24");
      const fill = bar.firstElementChild as HTMLElement;
      expect(fill.style.height).not.toBe("");
      expect(fill.style.height).not.toBe("0%");
    });
  });

  it("defaults to Viernes selected and shows its slots breakdown", () => {
    render(<PreviewCitas />);
    expect(screen.getByText("Slots del Vie — ejemplo de distribución por hora")).toBeInTheDocument();
  });

  it("switches the selected day when clicking a different day's bar or label", () => {
    render(<PreviewCitas />);
    fireEvent.click(screen.getByTestId("citas-semana-barra-Lun"));
    expect(screen.getByText("Slots del Lun — ejemplo de distribución por hora")).toBeInTheDocument();
  });
});
