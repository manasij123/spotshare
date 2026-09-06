import { Link } from "react-router-dom";
import { MapPin, MapPinOff } from "lucide-react";

interface ExpiredPageProps {
  notFound?: boolean;
}

export default function ExpiredPage({ notFound = false }: ExpiredPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <MapPinOff className="h-7 w-7" aria-hidden="true" />
      </span>
      {notFound ? (
        <>
          <h1 className="text-xl font-bold text-slate-900">Page not found</h1>
          <p className="max-w-sm text-sm text-slate-500">The page you're looking for doesn't exist.</p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold text-slate-900">Location expired</h1>
          <p className="max-w-sm text-sm text-slate-500">This shared location is no longer active.</p>
        </>
      )}
      <Link
        to="/"
        className="mt-2 flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        Go to SpotShare
      </Link>
    </div>
  );
}
