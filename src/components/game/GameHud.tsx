import { AnimatePresence, motion } from 'motion/react';

import type { SwipeEvent } from '@/types/game';
import { formatCountdown } from '@/utils/format';

interface GameHudProps {
  remainingMs: number;
  score: number;
  lastSwipe: SwipeEvent | null;
}

const LOW_TIME_MS = 10_000;

/** Timer (left) and score (right), overlaid on the top of the card like in the mockups. */
export function GameHud({ remainingMs, score, lastSwipe }: GameHudProps) {
  const isLowTime = remainingMs <= LOW_TIME_MS;
  const delta = lastSwipe?.outcome.type === 'match' ? lastSwipe.outcome.points : null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="rounded-2xl bg-white/70 px-3 py-1.5 backdrop-blur-sm">
        <p className="text-xs font-semibold text-ink-muted">Timer</p>
        <p
          className={`font-mono text-xl font-bold tabular-nums ${isLowTime ? 'text-nope' : 'text-ink'}`}
          aria-live="off"
        >
          {formatCountdown(remainingMs)}
        </p>
      </div>

      <div className="rounded-2xl bg-white/70 px-3 py-1.5 text-right backdrop-blur-sm">
        <p className="text-xs font-semibold text-ink-muted">Score:</p>
        <p className="flex items-baseline justify-end gap-1.5 text-xl font-bold tabular-nums">
          <span className={score < 0 ? 'text-nope' : 'text-ink'}>{score}</span>
          <AnimatePresence mode="popLayout">
            {delta !== null && (
              <motion.span
                key={lastSwipe?.eventId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-sm ${delta < 0 ? 'text-nope' : 'text-like'}`}
              >
                {delta > 0 ? `+${delta}` : delta}
              </motion.span>
            )}
          </AnimatePresence>
        </p>
      </div>
    </div>
  );
}
