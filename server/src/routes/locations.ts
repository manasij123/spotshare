import { Router } from "express";
import { searchPlaces } from "../lib/geocoding";
import { searchLocationSchema } from "../lib/validation";
import { searchLimiter } from "../middleware/rateLimit";
import { ApiError } from "../middleware/errorHandler";

export const locationsRouter = Router();

locationsRouter.post("/search", searchLimiter, async (req, res, next) => {
  try {
    const { query } = searchLocationSchema.parse(req.body);

    let results;
    try {
      results = await searchPlaces(query);
    } catch (geocodeError) {
      console.error("Geocoding provider error:", geocodeError);
      throw new ApiError(502, "Couldn't find that place. Try another name or address.");
    }

    res.json({ results });
  } catch (err) {
    next(err);
  }
});
