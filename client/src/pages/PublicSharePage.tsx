import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, MessageSquare } from "lucide-react";
import MapView from "../components/MapView";
import CountdownTimer from "../components/CountdownTimer";
import DirectionsButton from "../components/DirectionsButton";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getShare, ApiRequestError } from "../api/client";
import type { PublicShare } from "../types";

type PageState =
  | { status: "loading" }
  | { status: "active"; share: PublicShare }
  | { status: "expired"; placeName?: string }
  | { status: "not_found" }
  | { status: "error"; message: string };

export default function PublicSharePage() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    if (!shareId) return;
    setState({ status: "loading" });
    try {
      const result = await getShare(shareId);
      if (result.kind === "active") {
        setState({ status: "active", share: result.share });
      } else if (result.kind === "expired") {
        setState({ status: "expired", placeName: result.placeName });
      } else {
        setState({ status: "not_found" });
      }
    } catch (err) {
      setState({ status: "error", message: err instanceof ApiRequestError ? err.message : "Something went wrong on our side." });
    }
  }, [shareId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state.status === "loading") {
    return (
      <PageShell>
        <LoadingState label="Loading shared location..." />
      </PageShell>
    );
  }

  if (state.status === "not_found") {
    return (
      <PageShell>
        <ErrorState title="Invalid link" message="This location link is invalid." />
      </PageShell>
    );
  }

  if (state.status === "expired") {
    return (
      <PageShell>
        <ExpiredNotice placeName={state.placeName} />
      </PageShell>
    );
  }

  if (state.status === "error") {
    return (
      <PageShell>
        <ErrorState message={state.message} onRetry={() => void load()} />
      </PageShell>
    );
  }

  const { share } = state;

  return (
    <PageShell>
      <MapView
        latitude={share.latitude}
        longitude={share.longitude}
        className="h-72 w-full sm:h-96"
        label={`Map showing ${share.placeName}`}
      />

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="flex items-start gap-2 text-lg font-semibold text-slate-900">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
          {share.placeName}
        </p>
        <p className="ml-7 text-sm text-slate-500">{share.address}</p>

        <div className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Available for</p>
          <CountdownTimer
            expiresAt={share.expiresAt}
            onExpire={() => void load()}
            className="text-2xl font-bold text-brand-800"
          />
        </div>

        {share.note && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <p>{share.note}</p>
          </div>
        )}

        <div className="mt-5">
          <DirectionsButton latitude={share.latitude} longitude={share.longitude} label={share.placeName} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-4 w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        Create your own SpotShare link
      </button>
    </PageShell>
  );
}

function ExpiredNotice({ placeName }: { placeName?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
      <MapPin className="h-8 w-8 text-slate-300" aria-hidden="true" />
      <p className="text-lg font-semibold text-slate-900">Location expired</p>
      <p className="text-sm text-slate-500">
        {placeName ? `The link for ${placeName} is` : "This shared location is"} no longer active.
      </p>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 text-center text-lg font-bold tracking-tight text-slate-900">Shared Location</h1>
        {children}
      </div>
    </div>
  );
}
