// ============================================================
// DelegacionesMap — mapa Leaflet real de los 5 municipios de Nuevo León que
// corresponden a las delegaciones demo, coloreado por su `estado`
// (DEMO_DELEGACIONES, fluido/moderado/saturado). Los polígonos vienen del
// WFS público de INEGI, descargados una sola vez por
// scripts/load-nl-municipios-geojson.ts (ver ese archivo y
// docs/superpowers/specs/2026-08-18-mapa-delegaciones-design.md). Usa
// leaflet directo (no react-leaflet), mismo patrón que ya valida
// seguridad-edomex/client/src/components/TacticalMap.tsx — nunca se copió
// código de ese archivo, solo el patrón de useRef/useEffect + L.geoJSON.
// ============================================================

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEMO_DELEGACIONES } from "@/lib/demoData";
import { DELEGACION_A_MUNICIPIO_REAL } from "@/lib/delegacionMunicipios";
import { SkeletonCard } from "@/components/dashboard";

interface MunicipioProps {
  cveMuni: string;
  nombre: string;
}

type MunicipioFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon | GeoJSON.Polygon,
  MunicipioProps
>;

// Se pidió cachear a nivel de módulo en el diseño original, pero eso hace
// que una falla de red quede cacheada para siempre (ni un remount de este
// componente puede reintentar) — se descarga fresco en cada montaje en su
// lugar; el archivo pesa ~157 KB (ver scripts/load-nl-municipios-geojson.ts),
// no justifica arriesgar un estado de error permanente por una falla
// transitoria.
function getNlMunicipiosGeoJson(): Promise<MunicipioFeatureCollection | null> {
  return fetch("/data/nl-municipios.geojson")
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
}

// bindTooltip de Leaflet interpreta el string como HTML — se escapa por
// disciplina y consistencia, aunque aquí el texto es fijo en código, no
// viene de un formulario editable (mismo patrón que TacticalMap.tsx).
const escHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const ESTADO_COLOR: Record<string, string> = {
  fluido: "var(--success)",
  moderado: "var(--chart-2)",
  saturado: "var(--destructive)",
};

export default function DelegacionesMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [25.68, -100.25],
      zoom: 10,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    }).addTo(map);

    let cancelled = false;
    const porNombreReal = new Map(
      DEMO_DELEGACIONES.map((d) => [DELEGACION_A_MUNICIPIO_REAL[d.nombre].nombreReal, d])
    );

    getNlMunicipiosGeoJson().then((geojson) => {
      if (cancelled || !mapRef.current) return;
      if (!geojson) {
        setStatus("error");
        return;
      }

      // JSON que parsea pero no es GeoJSON válido (o cuyas geometrías están
      // corruptas) hace que L.geoJSON/addTo/fitBounds truenen — sin este
      // try/catch, esa excepción quedaba como una promesa rechazada sin
      // manejar y setStatus nunca se llamaba, dejando el skeleton de carga
      // girando para siempre (viola "nunca un mapa en blanco sin
      // explicación").
      try {
        const layer = L.geoJSON(geojson as GeoJSON.GeoJsonObject, {
          style: (feature) => {
            const d = feature?.properties?.nombre ? porNombreReal.get(feature.properties.nombre) : undefined;
            return {
              color: d ? ESTADO_COLOR[d.estado] : "var(--border)",
              weight: 2,
              fillOpacity: 0.45,
              fillColor: d ? ESTADO_COLOR[d.estado] : "var(--muted)",
            };
          },
          onEachFeature: (feature, featureLayer) => {
            const d = feature.properties?.nombre ? porNombreReal.get(feature.properties.nombre) : undefined;
            if (d) {
              featureLayer.bindTooltip(
                `<strong>${escHtml(d.nombre)}</strong><br/>${Math.round(d.ocupacion * 100)}% de ocupación`,
                { sticky: true }
              );
            }
          },
        });

        // Geojson válido pero sin ninguna feature que matchee (0 polígonos)
        // no debe pasar como "ready" — es un mapa base vacío sin explicación,
        // el mismo problema que el try/catch de arriba evita para el caso de
        // una excepción.
        if (layer.getLayers().length === 0) {
          setStatus("error");
          return;
        }

        layer.addTo(map);

        const bounds = layer.getBounds();
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    });

    const ro = new ResizeObserver(() => map.invalidateSize());
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      cancelled = true;
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="relative h-80 w-full overflow-hidden rounded-lg">
        {status === "loading" && (
          <div
            data-testid="delegaciones-map-loading"
            className="absolute inset-0 z-[1000] rounded-lg bg-card"
          >
            <SkeletonCard />
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">No se pudo cargar el mapa de delegaciones.</p>
          </div>
        )}
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {/* Leyenda/caption — los tooltips de Leaflet solo existen en el DOM al
          hacer hover, así que sin esto el nombre y % de 3 de las 5
          delegaciones nunca aparecen como texto (accesibilidad/lectores de
          pantalla). Dobla como leyenda de color: cada punto usa el mismo
          ESTADO_COLOR que pinta su polígono. Se muestra siempre (no solo en
          "ready") porque viene de DEMO_DELEGACIONES, no del geojson. */}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {DEMO_DELEGACIONES.map((d) => (
          <li key={d.nombre} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: ESTADO_COLOR[d.estado] }}
            />
            <span className="font-medium text-foreground">{d.nombre}</span>
            <span className="tabular-nums">{Math.round(d.ocupacion * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
