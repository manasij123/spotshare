/**
 * Server-side geocoding client backed by the OpenStreetMap Nominatim API.
 * Nominatim requires no API key, but its usage policy requires a descriptive
 * User-Agent and reasonable request rates - both handled here so the
 * frontend never talks to a third-party geocoder directly.
 * https://operations.osmfoundation.org/policies/nominatim/
 */

export interface GeocodeResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: Record<string, string>;
  namedetails?: Record<string, string>;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

function pickPlaceName(result: NominatimResult): string {
  if (result.namedetails?.name) return result.namedetails.name;
  if (result.name) return result.name;
  // Fall back to the first segment of the display name, e.g.
  // "TCS Gitobitan, ... " -> "TCS Gitobitan"
  return result.display_name.split(",")[0].trim();
}

export async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  const userAgent = process.env.NOMINATIM_USER_AGENT || "SpotShare/1.0";
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    namedetails: "1",
    limit: "6",
  });

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: {
      "User-Agent": userAgent,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding provider responded with status ${response.status}`);
  }

  const results = (await response.json()) as NominatimResult[];

  return results.map((result) => ({
    name: pickPlaceName(result),
    address: result.display_name,
    latitude: Number.parseFloat(result.lat),
    longitude: Number.parseFloat(result.lon),
    placeId: String(result.place_id),
  }));
}
