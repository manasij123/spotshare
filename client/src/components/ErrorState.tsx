import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({ title = "Something went wrong", message, onRetry, className = "" }: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-6 text-center ${className}`}
      role="alert"
    >
      <AlertTriangle className="h-7 w-7 text-red-500" aria-hidden="true" />
      <div>
        <p className="font-semibold text-red-800">{title}</p>
        <p className="mt-1 text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          Try again
        </button>
      )}
    </div>
  );
}
