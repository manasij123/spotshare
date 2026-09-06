export interface PlaceResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

export type SelectedLocation = PlaceResult;

export type DurationPreset = 15 | 30 | 60 | 120 | 180 | 240;

export const DURATION_PRESETS: { label: string; minutes: DurationPreset }[] = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "2 hours", minutes: 120 },
  { label: "3 hours", minutes: 180 },
  { label: "4 hours", minutes: 240 },
];

export interface CreateShareRequest {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  placeProviderId?: string;
  durationMinutes: number;
  note?: string;
}

export interface CreateShareResponse {
  shareId: string;
  shareUrl: string;
  expiresAt: string;
}

export type ShareStatus = "active" | "expired" | "revoked";

export interface PublicShare {
  shareId: string;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  note: string | null;
  createdAt: string;
  expiresAt: string;
  status: ShareStatus;
}

export interface ApiErrorPayload {
  error: string;
  details?: string[];
}

export interface ExpiredSharePayload {
  error: string;
  status: "expired" | "revoked";
  shareId: string;
  placeName: string;
}

export type GetShareResult =
  | { kind: "active"; share: PublicShare }
  | { kind: "expired"; placeName: string }
  | { kind: "not_found" };
