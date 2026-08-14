import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the given text", () => {
    render(<EmptyState text="Sin datos por ahora" />);
    expect(screen.getByText("Sin datos por ahora")).toBeInTheDocument();
  });
});
