import { useState } from "react";
import { Check, Copy, ExternalLink, MapPin, Share2 } from "lucide-react";
import type { CreateShareResponse } from "../types";

interface ShareResultProps {
  result: CreateShareResponse;
  placeName: string;
  durationMinutes: number;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} minute${mins === 1 ? "" : "s"}`;
  if (mins === 0) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${hours} hour${hours === 1 ? "" : "s"} ${mins} minute${mins === 1 ? "" : "s"}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function ShareResult({ result, placeName, durationMinutes }: ShareResultProps) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; the link is still visible/selectable in the box.
    }
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: "SpotShare location",
        text: `Meet me at ${placeName}`,
        url: result.shareUrl,
      });
    } catch {
      // User cancelled the native share sheet - no action needed.
    }
  }

  function handleOpen() {
    window.open(result.shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
      <p className="text-lg font-semibold text-slate-900">Your location link is ready</p>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3">
        <input
          readOnly
          value={result.shareUrl}
          aria-label="Shareable link"
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 truncate bg-transparent text-sm text-slate-700 focus:outline-none"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
        {canNativeShare ? (
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share
          </button>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={handleOpen}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Open
        </button>
      </div>

      <div className="mt-4 space-y-1 border-t border-brand-100 pt-4 text-sm">
        <p className="flex items-center gap-1.5 font-medium text-slate-800">
          <MapPin className="h-4 w-4 text-brand-600" aria-hidden="true" />
          {placeName}
        </p>
        <p className="text-slate-600">Available for: {formatDuration(durationMinutes)}</p>
        <p className="text-slate-600">Expires at: {formatTime(result.expiresAt)}</p>
      </div>
    </div>
  );
}
