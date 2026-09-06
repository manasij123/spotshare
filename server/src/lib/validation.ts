import { z } from "zod";

export const MIN_DURATION_MINUTES = 5;
// Cap custom durations at 24 hours so links can't be created to stay "active"
// indefinitely.
export const MAX_DURATION_MINUTES = 24 * 60;
export const NOTE_MAX_LENGTH = 200;

/** Public share tokens are fixed-length, alphanumeric strings (see lib/token.ts). */
export const TOKEN_PATTERN = /^[A-Za-z0-9]{6,16}$/;

export const searchLocationSchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, "Search query must be at least 2 characters.")
    .max(200, "Search query is too long."),
});

export const createShareSchema = z.object({
  placeName: z.string().trim().min(1, "Place name is required.").max(200),
  address: z.string().trim().min(1, "Address is required.").max(300),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  placeProviderId: z.string().trim().max(200).optional().nullable(),
  durationMinutes: z
    .number()
    .int()
    .min(MIN_DURATION_MINUTES, `Duration must be at least ${MIN_DURATION_MINUTES} minutes.`)
    .max(MAX_DURATION_MINUTES, `Duration cannot exceed ${MAX_DURATION_MINUTES} minutes.`),
  note: z.string().trim().max(NOTE_MAX_LENGTH, `Note cannot exceed ${NOTE_MAX_LENGTH} characters.`).optional(),
});

export const shareTokenParamSchema = z.object({
  shareId: z.string().regex(TOKEN_PATTERN, "Invalid share link."),
});

const CONTROL_CHARS_PATTERN = new RegExp("[\\x00-\\x1F\\x7F]", "g");

/**
 * Strips any HTML/markup and control characters from user-supplied free
 * text. The app never renders user text as HTML, but this keeps stored data
 * plain-text as defense-in-depth against any future rendering path.
 */
export function sanitizePlainText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(CONTROL_CHARS_PATTERN, "")
    .trim();
}
