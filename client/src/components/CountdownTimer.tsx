import { useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
  /** "digits" renders 01:24:36; "words" renders "1h 24m". */
  variant?: "digits" | "words";
  className?: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer({ expiresAt, onExpire, variant = "digits", className = "" }: CountdownTimerProps) {
  const { hours, minutes, seconds, isExpired } = useCountdown(expiresAt);

  useEffect(() => {
    if (isExpired) onExpire?.();
  }, [isExpired, onExpire]);

  const display =
    variant === "digits"
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : hours > 0
        ? `${hours}h ${minutes}m`
        : `${minutes}m ${seconds}s`;

  return (
    <span className={`font-mono tabular-nums tracking-tight ${className}`} aria-live="polite">
      {display}
    </span>
  );
}
