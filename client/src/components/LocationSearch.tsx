import { useEffect, useRef, useState } from "react";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { searchLocations, ApiRequestError } from "../api/client";
import type { PlaceResult } from "../types";

interface LocationSearchProps {
  onSelect: (place: PlaceResult) => void;
}

const DEBOUNCE_MS = 450;

export default function LocationSearch({ onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  async function runSearch(searchQuery: string) {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const { results: found } = await searchLocations(trimmed);
      if (requestId !== requestIdRef.current) return;
      setResults(found);
      setShowResults(true);
      if (found.length === 0) {
        setError("Couldn't find that place. Try another name or address.");
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setResults([]);
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void runSearch(query);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    void runSearch(query);
  }

  function handleSelect(place: PlaceResult) {
    setQuery(place.name);
    setShowResults(false);
    setResults([]);
    onSelect(place);
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            role="combobox"
            aria-expanded={showResults}
            aria-controls="location-search-results"
            aria-label="Search a place, address or landmark"
            placeholder="Search a place, address or landmark"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="flex h-auto min-w-[3.25rem] items-center justify-center rounded-xl bg-brand-600 px-4 text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
        </button>
      </form>

      {showResults && (results.length > 0 || error) && (
        <div
          id="location-search-results"
          role="listbox"
          className="absolute z-[1200] mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {error && results.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
              {error}
            </div>
          )}
          {results.map((place) => (
            <button
              key={place.placeId}
              type="button"
              role="option"
              aria-selected="false"
              onClick={() => handleSelect(place)}
              className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-brand-50 focus:bg-brand-50 focus:outline-none"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>
                <span className="block font-medium text-slate-900">{place.name}</span>
                <span className="block text-sm text-slate-500">{place.address}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
