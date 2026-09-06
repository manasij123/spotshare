import rateLimit from "express-rate-limit";

/** Generous limit for read-only public share lookups. */
export const shareReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down and try again shortly." },
});

/** Tighter limit for share creation to deter abuse/spam. */
export const shareCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many share links created. Please try again in a minute." },
});

/**
 * Nominatim's usage policy caps unauthenticated use at ~1 request/second per
 * client; this keeps us well within that even under bursty typing/autocomplete.
 */
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many searches. Please slow down and try again shortly." },
});
