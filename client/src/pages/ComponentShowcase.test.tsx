import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ComponentShowcase from "./ComponentShowcase";

describe("ComponentShowcase", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="light" switchable>
        <ComponentShowcase />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
