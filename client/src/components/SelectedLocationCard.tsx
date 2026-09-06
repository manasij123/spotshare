import { MapPin, Pencil } from "lucide-react";
import type { SelectedLocation } from "../types";

interface SelectedLocationCardProps {
  location: SelectedLocation;
  onChangeLocation: () => void;
}

export default function SelectedLocationCard({ location, onChangeLocation }: SelectedLocationCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-slate-900">{location.name}</p>
          <p className="text-sm text-slate-500">{location.address}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onChangeLocation}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Change
      </button>
    </div>
  );
}
