import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { LocateFixed } from "lucide-react";

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  /** Visual radius (meters) around the shared point. Not GPS accuracy. */
  radiusMeters?: number;
  className?: string;
  label?: string;
}

const DEFAULT_ZOOM = 16;

function blueDotIcon() {
  return L.divIcon({
    className: "spotshare-marker",
    html: `
      <div class="relative flex h-6 w-6 items-center justify-center">
        <span class="absolute inline-flex h-6 w-6 animate-pulse-ring rounded-full bg-brand-500"></span>
        <span class="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand-600 ring-2 ring-white shadow"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function RecenterOnChange({ latitude, longitude, zoom }: { latitude: number; longitude: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([latitude, longitude], zoom, { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);
  return null;
}

function RecenterButton({ latitude, longitude, zoom }: { latitude: number; longitude: number; zoom: number }) {
  const map = useMap();
  return (
    <button
      type="button"
      onClick={() => map.flyTo([latitude, longitude], zoom, { duration: 0.5 })}
      aria-label="Recenter map on the shared location"
      className="absolute bottom-4 right-4 z-[1000] flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-600 shadow-lg ring-1 ring-black/5 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <LocateFixed className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

export default function MapView({ latitude, longitude, zoom = DEFAULT_ZOOM, radiusMeters = 70, className = "", label }: MapViewProps) {
  const icon = useMemo(() => blueDotIcon(), []);
  const position: [number, number] = [latitude, longitude];

  return (
    <div
      className={`spotshare-map relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${className}`}
      role="figure"
      aria-label={label || "Map showing the shared location"}
    >
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full"
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <Circle
          center={position}
          radius={radiusMeters}
          pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.15, weight: 1 }}
        />
        <Marker position={position} icon={icon} />
        <RecenterOnChange latitude={latitude} longitude={longitude} zoom={zoom} />
        <RecenterButton latitude={latitude} longitude={longitude} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
