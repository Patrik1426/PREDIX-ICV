import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton, SkeletonCard, SkeletonKpi, SkeletonTable } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a pulsing placeholder block", () => {
    const { container } = render(<Skeleton className="h-4 w-10" />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});

describe("SkeletonCard", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});

describe("SkeletonKpi", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonKpi />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});

describe("SkeletonTable", () => {
  it("renders the requested number of rows", () => {
    const { container } = render(<SkeletonTable rows={3} cols={2} />);
    expect(container.children[0].children.length).toBe(3);
  });
});
