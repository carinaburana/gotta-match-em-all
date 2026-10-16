import { useEffect, useRef, useState } from 'react';

interface CountdownOptions {
  /** `performance.now()` timestamp when the countdown started, or null if not started. */
  startedAt: number | null;
  durationMs: number;
  /** Stop ticking (e.g. once the session is finished). */
  isRunning: boolean;
  /** Called once when time runs out, with the exact expiry timestamp. */
  onExpire: (expiredAt: number) => void;
}

const TICK_MS = 200;

/**
 * One interval per countdown. Remaining time is always computed from the start timestamp, so
 * the timer doesn't drift when the tab is throttled or a render is slow.
 */
export function useCountdown({
  startedAt,
  durationMs,
  isRunning,
  onExpire,
}: CountdownOptions): number {
  const [remainingMs, setRemainingMs] = useState(durationMs);

  // Keep the latest callback without restarting the interval (avoids stale closures).
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!isRunning || startedAt === null) return;

    const tick = () => {
      const remaining = Math.max(0, durationMs - (performance.now() - startedAt));
      setRemainingMs(remaining);
      if (remaining <= 0) {
        window.clearInterval(intervalId);
        onExpireRef.current(startedAt + durationMs);
      }
    };

    const intervalId = window.setInterval(tick, TICK_MS);
    tick();
    return () => window.clearInterval(intervalId);
  }, [isRunning, startedAt, durationMs]);

  return remainingMs;
}
