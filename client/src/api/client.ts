import type {
  ApiErrorPayload,
  CreateShareRequest,
  CreateShareResponse,
  ExpiredSharePayload,
  GetShareResult,
  PlaceResult,
  PublicShare,
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiRequestError(0, "Something went wrong. Please check your connection and try again.");
  }

  if (!response.ok) {
    let payload: ApiErrorPayload | null = null;
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      // response had no JSON body
    }
    throw new ApiRequestError(response.status, payload?.error || "Something went wrong. Please try again.");
  }

  return (await response.json()) as T;
}

export function searchLocations(query: string): Promise<{ results: PlaceResult[] }> {
  return request("/api/locations/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export function createShare(input: CreateShareRequest): Promise<CreateShareResponse> {
  return request("/api/shares", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getShare(shareId: string): Promise<GetShareResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/shares/${encodeURIComponent(shareId)}`);
  } catch {
    throw new ApiRequestError(0, "Something went wrong. Please check your connection and try again.");
  }

  if (response.status === 410) {
    const payload = (await response.json()) as ExpiredSharePayload;
    return { kind: "expired", placeName: payload.placeName };
  }

  if (response.status === 404) {
    return { kind: "not_found" };
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    throw new ApiRequestError(response.status, payload?.error || "Something went wrong. Please try again.");
  }

  const share = (await response.json()) as PublicShare;
  return { kind: "active", share };
}
