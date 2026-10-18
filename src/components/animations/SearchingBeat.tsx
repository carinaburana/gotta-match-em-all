import { AnimatePresence, motion } from 'motion/react';

import { NearbyMatchesRadar } from '@/components/animations/NearbyMatchesRadar';
import { useTimedProgress } from '@/hooks/useTimedProgress';

interface SearchingBeatProps {
  subtitle: string;
  /** Messages shown one after another while the fake progress runs. */
  steps: readonly string[];
  durationMs: number;
}

/**
 * The opening beat of the teaser: the completely fake "AI matchmaking" scan. The team's radar
 * artwork sweeps, the step messages cycle and a progress bar fills — it performs no analysis
 * at all, it just runs for `durationMs`.
 */
export function SearchingBeat({ subtitle, steps, durationMs }: SearchingBeatProps) {
  const progress = useTimedProgress(durationMs);
  const stepIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.35, ease: 'easeIn' } }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <NearbyMatchesRadar className="max-w-72" />

      <div className="w-full max-w-72 text-center">
        <p className="text-sm text-ink-muted">{subtitle}</p>
        <div className="mt-2 min-h-6" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold text-brand-600"
            >
              {steps[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-100"
          role="progressbar"
          aria-label="Matchmaking progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-500 to-accent-pink"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
