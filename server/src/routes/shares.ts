import { Router } from "express";
import type { Share } from "@prisma/client";
import { prisma } from "../db";
import { generateShareToken } from "../lib/token";
import { createShareSchema, shareTokenParamSchema, sanitizePlainText } from "../lib/validation";
import { shareCreateLimiter, shareReadLimiter } from "../middleware/rateLimit";
import { ApiError } from "../middleware/errorHandler";

export const sharesRouter = Router();

function buildShareUrl(publicToken: string): string {
  const base = (process.env.PUBLIC_APP_URL || "http://localhost:5173").replace(/\/$/, "");
  return `${base}/share/${publicToken}`;
}

function toPublicShare(share: Share) {
  return {
    shareId: share.publicToken,
    placeName: share.placeName,
    address: share.formattedAddress,
    latitude: share.latitude,
    longitude: share.longitude,
    note: share.note,
    createdAt: share.createdAt.toISOString(),
    expiresAt: share.expiresAt.toISOString(),
    status: share.status.toLowerCase(),
  };
}

/** Generates a unique token, retrying on the astronomically unlikely collision. */
async function createUniqueToken(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const token = generateShareToken();
    const existing = await prisma.share.findUnique({ where: { publicToken: token } });
    if (!existing) return token;
  }
  throw new ApiError(500, "Something went wrong on our side.");
}

sharesRouter.post("/", shareCreateLimiter, async (req, res, next) => {
  try {
    const input = createShareSchema.parse(req.body);
    const publicToken = await createUniqueToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + input.durationMinutes * 60 * 1000);

    const share = await prisma.share.create({
      data: {
        publicToken,
        placeName: sanitizePlainText(input.placeName),
        formattedAddress: sanitizePlainText(input.address),
        latitude: input.latitude,
        longitude: input.longitude,
        placeProviderId: input.placeProviderId ?? null,
        note: input.note ? sanitizePlainText(input.note) : null,
        expiresAt,
        status: "ACTIVE",
      },
    });

    res.status(201).json({
      shareId: share.publicToken,
      shareUrl: buildShareUrl(share.publicToken),
      expiresAt: share.expiresAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

sharesRouter.get("/:shareId", shareReadLimiter, async (req, res, next) => {
  try {
    const { shareId } = shareTokenParamSchema.parse(req.params);

    const share = await prisma.share.findUnique({ where: { publicToken: shareId } });
    if (!share) {
      throw new ApiError(404, "This location link is invalid.");
    }

    const isExpired = share.status === "ACTIVE" && share.expiresAt.getTime() <= Date.now();
    if (isExpired) {
      await prisma.share.update({ where: { id: share.id }, data: { status: "EXPIRED" } });
      share.status = "EXPIRED";
    }

    if (share.status !== "ACTIVE") {
      res.status(410).json({
        error: "This location link has expired.",
        status: share.status.toLowerCase(),
        shareId: share.publicToken,
        placeName: share.placeName,
      });
      return;
    }

    res.json(toPublicShare(share));
  } catch (err) {
    next(err);
  }
});
