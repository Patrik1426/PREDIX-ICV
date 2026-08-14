import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ModuleHeader } from "./ModuleHeader";

describe("ModuleHeader", () => {
  it("renders the title and eyebrow", () => {
    render(<ModuleHeader eyebrow="Proyección por ubicación" title="Ocupación por delegación" />);
    expect(screen.getByText("Ocupación por delegación")).toBeInTheDocument();
    expect(screen.getByText("Proyección por ubicación")).toBeInTheDocument();
  });

  it("renders the optional action", () => {
    render(<ModuleHeader eyebrow="x" title="y" action={<button>Ver todo</button>} />);
    expect(screen.getByRole("button", { name: "Ver todo" })).toBeInTheDocument();
  });
});
