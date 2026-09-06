import { Loader2, Link2 } from "lucide-react";

interface CreateShareButtonProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export default function CreateShareButton({ disabled, loading, onClick }: CreateShareButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Creating link...
        </>
      ) : (
        <>
          <Link2 className="h-5 w-5" aria-hidden="true" />
          Create Share Link
        </>
      )}
    </button>
  );
}
