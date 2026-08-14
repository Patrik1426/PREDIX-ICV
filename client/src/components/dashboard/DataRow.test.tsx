import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlertTriangle } from "lucide-react";
import { DataRow } from "./DataRow";

describe("DataRow", () => {
  it("renders label and value", () => {
    render(
      <DataRow icon={<AlertTriangle />} label="Registro vehicular" value="+25 min" colorClassName="text-status-saturado" />
    );
    expect(screen.getByText("Registro vehicular")).toBeInTheDocument();
    expect(screen.getByText("+25 min")).toBeInTheDocument();
  });
});
