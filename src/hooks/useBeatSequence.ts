import { useEffect, useRef } from 'react';

import { useTimedProgress } from '@/hooks/useTimedProgress';

/**
 * Steps through named beats with fixed durations (e.g. the teaser and ending animations).
 * Returns the current beat — `finalBeat` once all timed beats are over — and calls `onComplete`
 * once when the final beat is reached.
 */
export function useBeatSequence<TBeat extends string, TFinal extends string>(
  durationsMs: Readonly<Record<TBeat, number>>,
  finalBeat: TFinal,
  onComplete: () => void,
): TBeat | TFinal {
  const beats = Object.keys(durationsMs) as TBeat[];
  const totalMs = beats.reduce((sum, beat) => sum + durationsMs[beat], 0);
  const elapsedMs = useTimedProgress(totalMs) * totalMs;

  let current: TBeat | TFinal = finalBeat;
  let beatEndMs = 0;
  for (const beat of beats) {
    beatEndMs += durationsMs[beat];
    if (elapsedMs < beatEndMs) {
      current = beat;
      break;
    }
  }

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    if (current === finalBeat) onCompleteRef.current();
  }, [current, finalBeat]);

  return current;
}
