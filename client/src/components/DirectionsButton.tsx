import { Navigation } from "lucide-react";

interface DirectionsButtonProps {
  latitude: number;
  longitude: number;
  label: string;
  className?: string;
}

function isAndroid(): boolean {
  return typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
}

function buildDirectionsHref(latitude: number, longitude: number, label: string): string {
  if (isAndroid()) {
    // geo: URIs let Android offer the user's installed maps/navigation apps.
    return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(label)})`;
  }
  // OpenStreetMap-based directions for desktop/iOS - no Google Maps dependency.
  return `https://www.openstreetmap.org/directions?from=&to=${latitude}%2C${longitude}#map=17/${latitude}/${longitude}`;
}

export default function DirectionsButton({ latitude, longitude, label, className = "" }: DirectionsButtonProps) {
  const href = buildDirectionsHref(latitude, longitude, label);

  return (
    <a
      href={href}
      target={isAndroid() ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={`Get directions to ${label}`}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${className}`}
    >
      <Navigation className="h-5 w-5" aria-hidden="true" />
      Get Directions
    </a>
  );
}
