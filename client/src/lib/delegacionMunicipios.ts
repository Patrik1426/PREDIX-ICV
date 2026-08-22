/**
 * Traduce el nombre de delegación demo (DEMO_DELEGACIONES, en demoData.ts) al
 * nombre y clave reales del municipio de Nuevo León en el Marco
 * Geoestadístico de INEGI. Usado por scripts/load-nl-municipios-geojson.ts
 * (para armar el filtro WFS) y por DelegacionesMap.tsx (para cruzar el
 * GeoJSON descargado con el estado demo de cada delegación).
 *
 * Verificado contra el WFS real de INEGI (cve_ent=19): las primeras 5 claves
 * el 2026-08-18 (entonces "Monterrey Centro" -> municipio "Monterrey", una
 * aproximación ya que "Centro" era una zona interna, no un municipio propio),
 * extendido a 9 el 2026-08-22 cuando la delegación se renombró a "Monterrey"
 * (ya sin aproximación, mapeo directo al municipio). El resto son mapeos de
 * nombre corto a nombre oficial (ej. "San Pedro GG" -> "San Pedro Garza
 * García", "Sta. Catarina" -> "Santa Catarina", "Escobedo" -> "General
 * Escobedo"), no aproximaciones geográficas.
 */
export const DELEGACION_A_MUNICIPIO_REAL: Record<string, { nombreReal: string; cveMuni: string }> = {
  "Monterrey": { nombreReal: "Monterrey", cveMuni: "19039" },
  "San Nicolás": { nombreReal: "San Nicolás de los Garza", cveMuni: "19046" },
  "Guadalupe": { nombreReal: "Guadalupe", cveMuni: "19026" },
  "Apodaca": { nombreReal: "Apodaca", cveMuni: "19006" },
  "San Pedro GG": { nombreReal: "San Pedro Garza García", cveMuni: "19019" },
  "García": { nombreReal: "García", cveMuni: "19018" },
  "Sta. Catarina": { nombreReal: "Santa Catarina", cveMuni: "19048" },
  "Escobedo": { nombreReal: "General Escobedo", cveMuni: "19021" },
  "Juárez": { nombreReal: "Juárez", cveMuni: "19031" },
};
