// scripts/load-nl-municipios-geojson.ts
/**
 * load-nl-municipios-geojson.ts — Descarga los polígonos reales de los 5
 * municipios de Nuevo León que corresponden a las delegaciones demo
 * (DEMO_DELEGACIONES) desde el WFS público de INEGI (mismo servicio que usó
 * seguridad-edomex para Edomex, ver su scripts/load-municipios-geojson.ts).
 *
 * A diferencia de esa referencia, aquí solo se piden 5 municipios (no los 51
 * del estado) — el resultado ya es chico (158 KB sin simplificar, verificado
 * en la consulta de prueba del 2026-08-18), así que no se usa
 * @turf/simplify.
 *
 * Uso: pnpm exec tsx scripts/load-nl-municipios-geojson.ts
 */

import { writeFileSync, mkdirSync } from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DELEGACION_A_MUNICIPIO_REAL } from "../client/src/lib/delegacionMunicipios";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../client/public/data/nl-municipios.geojson");

const NOMBRES_REALES = Object.values(DELEGACION_A_MUNICIPIO_REAL).map((m) => m.nombreReal);
const filtroNombres = NOMBRES_REALES.map((n) => `'${n}'`).join(",");
const WFS_URL =
  "https://mapas.inegi.org.mx/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature" +
  "&typeName=geografia:pi_mgn_areas_geoestadisticas_municipales" +
  "&outputFormat=application/json&cql_filter=" +
  encodeURIComponent(`cve_ent='19' AND nomgeo IN (${filtroNombres})`);

interface InegiFeature {
  type: "Feature";
  geometry: { type: string; coordinates: unknown };
  properties: { cvegeo: string; nomgeo: string };
}

interface InegiFeatureCollection {
  type: "FeatureCollection";
  features: InegiFeature[];
}

async function main() {
  console.log("[nl-municipios-geojson] Consultando WFS de INEGI (Marco Geoestadístico)...");
  const res = await fetch(WFS_URL);
  if (!res.ok) {
    throw new Error(`WFS de INEGI respondió ${res.status}`);
  }
  const data = (await res.json()) as InegiFeatureCollection;

  const cveEsperadas = new Set(Object.values(DELEGACION_A_MUNICIPIO_REAL).map((m) => m.cveMuni));
  const cveRecibidas = new Set(data.features.map((f) => f.properties.cvegeo));
  const faltantes = [...cveEsperadas].filter((c) => !cveRecibidas.has(c));
  const sobrantes = [...cveRecibidas].filter((c) => !cveEsperadas.has(c));
  if (faltantes.length > 0 || sobrantes.length > 0) {
    throw new Error(
      `Desajuste de claves entre INEGI y delegacionMunicipios.ts — faltantes: [${faltantes.join(",")}], sobrantes: [${sobrantes.join(",")}]`
    );
  }
  if (data.features.length !== 5) {
    throw new Error(`Se esperaban 5 municipios, llegaron ${data.features.length}`);
  }

  const limpio: InegiFeatureCollection = {
    type: "FeatureCollection",
    features: data.features.map((f) => ({
      type: "Feature",
      geometry: f.geometry as InegiFeature["geometry"],
      properties: { cveMuni: f.properties.cvegeo, nombre: f.properties.nomgeo },
    })) as unknown as InegiFeature[],
  };

  mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(limpio));

  const pesoKb = (Buffer.byteLength(JSON.stringify(limpio)) / 1024).toFixed(0);
  console.log(`[nl-municipios-geojson] 5/5 municipios verificados (${pesoKb} KB), guardado en ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("[nl-municipios-geojson] Error:", error);
  process.exit(1);
});
