import { randomBytes } from "crypto";

// Excludes visually ambiguous characters (0/O, 1/I/l) to keep tokens easy to
// read and type when shared verbally or via short links.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";

/**
 * Generates a cryptographically random, URL-safe public share token.
 * Not sequential and not derived from the database id, so it can be safely
 * exposed in share links without leaking record identifiers or counts.
 */
export function generateShareToken(length = 8): string {
  const bytes = randomBytes(length);
  let token = "";
  for (let i = 0; i < length; i++) {
    token += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return token;
}
