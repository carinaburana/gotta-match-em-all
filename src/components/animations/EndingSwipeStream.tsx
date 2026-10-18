import { motion } from 'motion/react';

import { AlienImage } from '@/components/cards/AlienImage';
import { CloseIcon, HeartIcon } from '@/components/ui/icons';
import type { SwipeDirection } from '@/types/game';

/** A point on the stage: px right of the horizontal centre, px above a horizontal band. */
export interface StagePoint {
  x: number;
  y: number;
}

interface EndingSwipeStreamProps {
  /** One entry per mini card, in flight order. */
  directions: readonly SwipeDirection[];
  portraitSrcs: readonly string[];
  /** Height of the band the points are measured from, as a CSS `bottom` value (e.g. '50%'). */
  band: string;
  /** Where cards take off (the player's card) and where they land (the pile). */
  from: StagePoint;
  to: StagePoint;
  staggerMs: number;
  flightMs: number;
}

/** Fixed, varied resting angles so the pile looks hand-stacked rather than computed. */
const PILE_ROTATIONS = [-7, 5, -2, 8, -5, 3, -9, 6, 1, -4, 7, -1];

/**
 * The "harvest" beat: the player's swipes flicked one by one from their own card onto the
 * company's pile — the deck seen from the other side of the counter.
 */
export function EndingSwipeStream({
  directions,
  portraitSrcs,
  band,
  from,
  to,
  staggerMs,
  flightMs,
}: EndingSwipeStreamProps) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 h-0 w-0"
      style={{ bottom: band }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      aria-hidden
    >
      {directions.map((direction, index) => {
        const delay = (index * staggerMs) / 1000;
        const duration = flightMs / 1000;
        const sign = direction === 'right' ? 1 : -1;
        const restRotate = PILE_ROTATIONS[index % PILE_ROTATIONS.length] ?? 0;
        const restX = to.x + ((index * 7) % 9) - 4;
        const restY = to.y - index * 1.5;
        const base = { delay, duration };

        return (
          <motion.div
            key={index}
            className="absolute -top-11 -left-8 h-22 w-16 overflow-hidden rounded-lg bg-brand-100 shadow-lg shadow-black/50 ring-2 ring-white/80"
            style={{ zIndex: index }}
            initial={{ x: from.x, y: from.y, scale: 0.4, rotate: 0, opacity: 0 }}
            animate={{
              x: [from.x, restX],
              y: [from.y, from.y - 110, restY],
              scale: [0.4, 0.9, 0.72],
              rotate: [0, sign * 18, restRotate],
              opacity: [0, 1, 1],
            }}
            transition={{
              x: { ...base, ease: 'easeInOut' },
              // Up quickly, then fall onto the pile: a real throw rather than a slide.
              y: { ...base, times: [0, 0.42, 1], ease: ['easeOut', 'easeIn'] },
              scale: { ...base, times: [0, 0.42, 1], ease: 'easeInOut' },
              rotate: { ...base, times: [0, 0.5, 1], ease: 'easeInOut' },
              opacity: { ...base, times: [0, 0.12, 1] },
            }}
          >
            <AlienImage src={portraitSrcs[index % portraitSrcs.length] ?? ''} alt="" />
            <span
              className={`absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full text-white ring-2 ring-white ${
                direction === 'right' ? 'bg-like' : 'bg-nope'
              }`}
            >
              {direction === 'right' ? (
                <HeartIcon className="h-3.5 w-3.5" strokeWidth={3} />
              ) : (
                <CloseIcon className="h-3.5 w-3.5" strokeWidth={3} />
              )}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
