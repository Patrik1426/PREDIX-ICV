import { describe, expect, it } from "vitest";
import { DEMO_DELEGACIONES } from "./demoData";
import { DELEGACION_A_MUNICIPIO_REAL } from "./delegacionMunicipios";

describe("DELEGACION_A_MUNICIPIO_REAL", () => {
  it("has an entry for every delegación demo, with a real municipio name and a 5-digit cveMuni", () => {
    for (const d of DEMO_DELEGACIONES) {
      const entry = DELEGACION_A_MUNICIPIO_REAL[d.nombre];
      expect(entry).toBeDefined();
      expect(entry.nombreReal.length).toBeGreaterThan(0);
      expect(entry.cveMuni).toMatch(/^19\d{3}$/);
    }
  });

  it("maps the 5 real Nuevo León municipios verified against INEGI (2026-08-18)", () => {
    expect(DELEGACION_A_MUNICIPIO_REAL["Monterrey Centro"]).toEqual({ nombreReal: "Monterrey", cveMuni: "19039" });
    expect(DELEGACION_A_MUNICIPIO_REAL["San Nicolás"]).toEqual({ nombreReal: "San Nicolás de los Garza", cveMuni: "19046" });
    expect(DELEGACION_A_MUNICIPIO_REAL["Guadalupe"]).toEqual({ nombreReal: "Guadalupe", cveMuni: "19026" });
    expect(DELEGACION_A_MUNICIPIO_REAL["Apodaca"]).toEqual({ nombreReal: "Apodaca", cveMuni: "19006" });
    expect(DELEGACION_A_MUNICIPIO_REAL["San Pedro"]).toEqual({ nombreReal: "San Pedro Garza García", cveMuni: "19019" });
  });
});
