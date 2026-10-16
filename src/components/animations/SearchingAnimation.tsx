import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

import { NearbyMatchesRadar } from '@/components/animations/NearbyMatchesRadar';
import { useTimedProgress } from '@/hooks/useTimedProgress';

interface SearchingAnimationProps {
  title: string;
  subtitle: string;
  /** Messages shown one after another while the fake progress runs. */
  steps: string[];
  durationMs: number;
  /** Centre illustration. Defaults to the animated "nearby matches" radar. */
  illustration?: ReactNode;
  /** Rendered below the text; receives whether the "analysis" has finished. */
  renderAction?: (isComplete: boolean) => ReactNode;
}

/**
 * Theatrical, completely fake "AI matchmaking" sequence. It performs no analysis at all —
 * it just animates for `durationMs`. The content is configurable so the joke can be rewritten.
 */
export function SearchingAnimation({
  title,
  subtitle,
  steps,
  durationMs,
  illustration,
  renderAction,
}: SearchingAnimationProps) {
  const progress = useTimedProgress(durationMs);
  const isComplete = progress >= 1;
  const stepIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));

  return (
    <div className="flex h-full flex-col items-center text-center">
      <div className="flex w-full flex-1 items-center justify-center py-6">
        {illustration ?? <NearbyMatchesRadar className="max-w-80" />}
      </div>

      <h2 className="text-2xl font-bold text-brand-700">{title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>

      <div className="mt-6 h-6 w-full" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium text-brand-600"
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
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress * 100}%` }} />
      </div>

      {renderAction && <div className="mt-6 w-full">{renderAction(isComplete)}</div>}
    </div>
  );
}
