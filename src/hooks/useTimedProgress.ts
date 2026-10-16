import { useEffect, useState } from 'react';

/** Returns progress from 0 to 1 over `durationMs`, starting on mount. Used for fake loading UIs. */
export function useTimedProgress(durationMs: number): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let frameId = 0;
    const step = () => {
      const next = Math.min(1, (performance.now() - startedAt) / durationMs);
      setProgress(next);
      if (next < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [durationMs]);

  return progress;
}
