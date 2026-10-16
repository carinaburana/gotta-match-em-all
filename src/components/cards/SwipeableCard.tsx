import { motion, useIsPresent, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import type { ReactNode } from 'react';

import { cardVariants } from '@/components/animations/variants';
import { GAME_CONFIG } from '@/game/config';
import type { SwipeDirection } from '@/types/game';

interface SwipeableCardProps {
  candidateId: string;
  onSwipe: (candidateId: string, direction: SwipeDirection) => void;
  disabled?: boolean;
  children: ReactNode;
}

/** Decides whether a drag gesture counts as a swipe. Pure, so it's easy to tweak. */
function getSwipeDirection(info: PanInfo): SwipeDirection | null {
  const { distanceThresholdPx, velocityThresholdPxPerS } = GAME_CONFIG.swipe;
  const { x: offset } = info.offset;
  const { x: velocity } = info.velocity;
  if (offset > distanceThresholdPx || velocity > velocityThresholdPxPerS) return 'right';
  if (offset < -distanceThresholdPx || velocity < -velocityThresholdPxPerS) return 'left';
  return null;
}

/**
 * Adds drag-to-swipe to any card content. It only *reports* swipes via `onSwipe`; the game
 * reducer decides what a swipe means. Must be rendered inside <AnimatePresence>.
 */
export function SwipeableCard({
  candidateId,
  onSwipe,
  disabled = false,
  children,
}: SwipeableCardProps) {
  // Once a card is leaving it must not accept new gestures (prevents duplicate swipes).
  const isPresent = useIsPresent();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -20], [1, 0]);

  const canDrag = isPresent && !disabled;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ x, rotate }}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag={canDrag ? 'x' : false}
      dragSnapToOrigin
      onDragEnd={(_, info) => {
        const direction = getSwipeDirection(info);
        if (direction && canDrag) onSwipe(candidateId, direction);
      }}
    >
      {children}

      <motion.span
        aria-hidden
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute top-24 left-6 -rotate-12 rounded-xl border-4 border-like px-3 py-1 text-3xl font-black tracking-wider text-like"
      >
        LIKE
      </motion.span>
      <motion.span
        aria-hidden
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute top-24 right-6 rotate-12 rounded-xl border-4 border-nope px-3 py-1 text-3xl font-black tracking-wider text-nope"
      >
        NOPE
      </motion.span>
    </motion.div>
  );
}
