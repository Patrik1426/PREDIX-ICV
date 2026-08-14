import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusRing } from "./StatusRing";

describe("StatusRing", () => {
  it("renders the center value and label", () => {
    render(<StatusRing value={70} label="ESPERANDO" centerValue="42" />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("ESPERANDO")).toBeInTheDocument();
  });

  it("uses fluido color at 40%", () => {
    const { container } = render(<StatusRing value={40} label="X" centerValue="1" />);
    expect(container.querySelector(".text-status-fluido")).not.toBeNull();
  });

  it("uses presion color at 70%", () => {
    const { container } = render(<StatusRing value={70} label="X" centerValue="1" />);
    expect(container.querySelector(".text-status-presion")).not.toBeNull();
  });

  it("uses saturado color at 90%", () => {
    const { container } = render(<StatusRing value={90} label="X" centerValue="1" />);
    expect(container.querySelector(".text-status-saturado")).not.toBeNull();
  });
});
