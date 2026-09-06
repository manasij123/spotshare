import { useEffect, useState } from "react";

export interface Countdown {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function computeCountdown(expiresAt: string): Countdown {
  const totalMs = Math.max(0, new Date(expiresAt).getTime() - Date.now());
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    totalMs,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isExpired: totalMs <= 0,
  };
}

/** Ticks every second toward `expiresAt`, an authoritative server timestamp. */
export function useCountdown(expiresAt: string): Countdown {
  const [countdown, setCountdown] = useState(() => computeCountdown(expiresAt));

  useEffect(() => {
    setCountdown(computeCountdown(expiresAt));
    const interval = setInterval(() => {
      setCountdown(computeCountdown(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return countdown;
}
