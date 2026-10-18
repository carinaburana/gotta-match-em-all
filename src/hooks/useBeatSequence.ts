import { useEffect, useRef, useState } from 'react';

/**
 * Steps through named beats with fixed durations (e.g. the teaser and ending animations).
 * Returns the current beat — `finalBeat` once all timed beats are over — and calls `onComplete`
 * once when the final beat is reached.
 *
 * One timeout per beat change, so the (large) animation trees below only re-render a handful of
 * times instead of on every animation frame.
 */
export function useBeatSequence<TBeat extends string, TFinal extends string>(
  durationsMs: Readonly<Record<TBeat, number>>,
  finalBeat: TFinal,
  onComplete: () => void,
): TBeat | TFinal {
  const beats = Object.keys(durationsMs) as TBeat[];
  const [beatIndex, setBeatIndex] = useState(0);
  const current: TBeat | TFinal = beats[beatIndex] ?? finalBeat;

  // The schedule is read through a ref so the effect re-arms only when it actually changes
  // (same beats, same durations), not whenever a caller passes a fresh object.
  const durationsRef = useRef(durationsMs);
  durationsRef.current = durationsMs;
  const scheduleKey = beats.map((beat) => `${beat}:${durationsMs[beat]}`).join(',');

  useEffect(() => {
    setBeatIndex(0);
    let elapsedMs = 0;
    const timeoutIds = Object.entries<number>(durationsRef.current).map(([, ms], index) => {
      elapsedMs += ms;
      return window.setTimeout(() => setBeatIndex(index + 1), elapsedMs);
    });
    return () => timeoutIds.forEach((id) => window.clearTimeout(id));
  }, [scheduleKey]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    if (current === finalBeat) onCompleteRef.current();
  }, [current, finalBeat]);

  return current;
}
