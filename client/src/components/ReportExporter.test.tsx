import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReportExporter, { buildCsv } from "./ReportExporter";

describe("buildCsv", () => {
  it("builds a CSV header plus one line per row", () => {
    const csv = buildCsv([
      { metrica: "Tiempo de espera", valor: "14" },
      { metrica: 'Con "cita" previa', valor: "22" },
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Métrica,Valor");
    expect(lines[1]).toBe('"Tiempo de espera","14"');
    expect(lines[2]).toBe('"Con ""cita"" previa","22"');
  });

  it("escapes an embedded quote in the valor field with RFC-4180 doubling, not backslashes", () => {
    const csv = buildCsv([{ metrica: "Comentario", valor: 'Con "cita" previa' }]);
    const lines = csv.split("\n");
    expect(lines[1]).toBe('"Comentario","Con ""cita"" previa"');
    expect(lines[1]).not.toContain("\\");
  });
});

describe("ReportExporter", () => {
  it("opens the dialog and offers a CSV download button", () => {
    render(<ReportExporter rows={[{ metrica: "Tiempo de espera", valor: "14" }]} />);
    fireEvent.click(screen.getByRole("button", { name: /Generar reporte/ }));
    expect(screen.getByRole("button", { name: /Descargar CSV/ })).toBeInTheDocument();
  });
});
