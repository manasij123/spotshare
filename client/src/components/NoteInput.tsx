const MAX_LENGTH = 200;

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NoteInput({ value, onChange }: NoteInputProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor="note" className="text-sm font-medium text-slate-600">
          Additional instructions <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <span className="text-xs text-slate-400">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      <textarea
        id="note"
        rows={2}
        maxLength={MAX_LENGTH}
        placeholder="Example: Wait near the main gate."
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        className="w-full resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-base placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}
