/**
 * Traduce el nombre de delegación demo (DEMO_DELEGACIONES, en demoData.ts) al
 * nombre y clave reales del municipio de Nuevo León en el Marco
 * Geoestadístico de INEGI. Usado por scripts/load-nl-municipios-geojson.ts
 * (para armar el filtro WFS) y por DelegacionesMap.tsx (para cruzar el
 * GeoJSON descargado con el estado demo de cada delegación).
 *
 * Verificado contra el WFS real de INEGI (cve_ent=19) el 2026-08-18.
 * "Monterrey Centro" es una aproximación: "Centro" es una zona dentro del
 * municipio de Monterrey, no un municipio propio — se usa el polígono
 * completo de Monterrey. El resto son mapeos de nombre corto a nombre
 * oficial (ej. "San Pedro" -> "San Pedro Garza García"), no aproximaciones
 * geográficas.
 */
export const DELEGACION_A_MUNICIPIO_REAL: Record<string, { nombreReal: string; cveMuni: string }> = {
  "Monterrey Centro": { nombreReal: "Monterrey", cveMuni: "19039" },
  "San Nicolás": { nombreReal: "San Nicolás de los Garza", cveMuni: "19046" },
  "Guadalupe": { nombreReal: "Guadalupe", cveMuni: "19026" },
  "Apodaca": { nombreReal: "Apodaca", cveMuni: "19006" },
  "San Pedro": { nombreReal: "San Pedro Garza García", cveMuni: "19019" },
};
