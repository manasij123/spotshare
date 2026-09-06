import { useState } from "react";
import { MapPin, RotateCcw } from "lucide-react";
import LocationSearch from "../components/LocationSearch";
import MapView from "../components/MapView";
import SelectedLocationCard from "../components/SelectedLocationCard";
import DurationSelector from "../components/DurationSelector";
import NoteInput from "../components/NoteInput";
import CreateShareButton from "../components/CreateShareButton";
import ShareResult from "../components/ShareResult";
import ErrorState from "../components/ErrorState";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { createShare, ApiRequestError } from "../api/client";
import type { CreateShareResponse, SelectedLocation } from "../types";

const DEFAULT_MAP_CENTER: SelectedLocation = {
  name: "Kolkata",
  address: "Kolkata, West Bengal, India",
  latitude: 22.5726,
  longitude: 88.3639,
  placeId: "default",
};

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [shareResult, setShareResult] = useState<CreateShareResponse | null>(null);

  const mapLocation = selectedLocation ?? DEFAULT_MAP_CENTER;
  const canCreate = Boolean(selectedLocation) && Boolean(durationMinutes);
  // Leaflet cannot size itself inside a display:none container, so only one
  // MapView is ever mounted at a time rather than hiding a duplicate with CSS.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  async function handleCreateShare() {
    if (!selectedLocation || !durationMinutes) return;
    setCreating(true);
    setCreateError(null);
    try {
      const result = await createShare({
        placeName: selectedLocation.name,
        address: selectedLocation.address,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        placeProviderId: selectedLocation.placeId,
        durationMinutes,
        note: note.trim() || undefined,
      });
      setShareResult(result);
    } catch (err) {
      setCreateError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function handleStartOver() {
    setSelectedLocation(null);
    setDurationMinutes(null);
    setNote("");
    setShareResult(null);
    setCreateError(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <MapPin className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">SpotShare</h1>
            <p className="text-sm text-slate-500">Share a place temporarily</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[26rem_1fr]">
          <div className="flex flex-col gap-5 lg:order-1">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Where should they meet you?</h2>
              <LocationSearch onSelect={setSelectedLocation} />
            </section>

            {selectedLocation && (
              <SelectedLocationCard location={selectedLocation} onChangeLocation={() => setSelectedLocation(null)} />
            )}

            {/* Map appears here on mobile, between search and controls; on desktop it moves to the right column. */}
            {!isDesktop && (
              <MapView
                latitude={mapLocation.latitude}
                longitude={mapLocation.longitude}
                className="h-64 w-full"
                label={`Map centered on ${mapLocation.name}`}
              />
            )}

            {!shareResult ? (
              <>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-lg font-semibold text-slate-900">How long will they be there?</h2>
                  <DurationSelector value={durationMinutes} onChange={setDurationMinutes} />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <NoteInput value={note} onChange={setNote} />
                </section>

                {createError && <ErrorState message={createError} onRetry={() => setCreateError(null)} />}

                <CreateShareButton disabled={!canCreate} loading={creating} onClick={handleCreateShare} />
              </>
            ) : (
              <>
                <ShareResult result={shareResult} placeName={selectedLocation!.name} durationMinutes={durationMinutes!} />
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Share another location
                </button>
              </>
            )}
          </div>

          {isDesktop && (
            <div className="lg:order-2">
              <MapView
                latitude={mapLocation.latitude}
                longitude={mapLocation.longitude}
                className="h-[calc(100vh-9rem)] min-h-[28rem] w-full"
                label={`Map centered on ${mapLocation.name}`}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
