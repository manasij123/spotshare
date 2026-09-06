import { useState } from "react";
import { DURATION_PRESETS } from "../types";

interface DurationSelectorProps {
  value: number | null;
  onChange: (minutes: number | null) => void;
}

const MIN_CUSTOM_MINUTES = 5;
const MAX_CUSTOM_MINUTES = 24 * 60;
const presetMinutes = new Set(DURATION_PRESETS.map((p) => p.minutes));

export default function DurationSelector({ value, onChange }: DurationSelectorProps) {
  const [isCustom, setIsCustom] = useState(value !== null && !presetMinutes.has(value as never));
  const [customInput, setCustomInput] = useState(value && !presetMinutes.has(value as never) ? String(value) : "");
  const customInvalid =
    isCustom && customInput !== "" && (Number(customInput) < MIN_CUSTOM_MINUTES || Number(customInput) > MAX_CUSTOM_MINUTES);

  function selectPreset(minutes: number) {
    setIsCustom(false);
    setCustomInput("");
    onChange(minutes);
  }

  function selectCustom() {
    setIsCustom(true);
    onChange(null);
  }

  function handleCustomInput(raw: string) {
    setCustomInput(raw);
    const parsed = Number(raw);
    if (raw !== "" && Number.isInteger(parsed) && parsed >= MIN_CUSTOM_MINUTES && parsed <= MAX_CUSTOM_MINUTES) {
      onChange(parsed);
    } else {
      onChange(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
        {DURATION_PRESETS.map((preset) => {
          const active = !isCustom && value === preset.minutes;
          return (
            <button
              key={preset.minutes}
              type="button"
              aria-pressed={active}
              onClick={() => selectPreset(preset.minutes)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                active
                  ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={isCustom}
          onClick={selectCustom}
          className={`rounded-xl border px-4 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
            isCustom
              ? "border-brand-600 bg-brand-600 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50"
          }`}
        >
          Custom
        </button>
      </div>

      {isCustom && (
        <div className="mt-3">
          <label htmlFor="custom-duration" className="mb-1 block text-sm font-medium text-slate-600">
            Duration in minutes
          </label>
          <input
            id="custom-duration"
            type="number"
            inputMode="numeric"
            min={MIN_CUSTOM_MINUTES}
            max={MAX_CUSTOM_MINUTES}
            placeholder="e.g. 90"
            value={customInput}
            onChange={(e) => handleCustomInput(e.target.value)}
            className={`w-full max-w-[10rem] rounded-xl border px-3 py-2.5 text-base focus:outline-none focus:ring-2 ${
              customInvalid ? "border-red-300 focus:ring-red-100" : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
            }`}
          />
          {customInvalid && (
            <p className="mt-1 text-xs text-red-600">
              Enter between {MIN_CUSTOM_MINUTES} and {MAX_CUSTOM_MINUTES} minutes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
