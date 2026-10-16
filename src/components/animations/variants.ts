import type { Transition, Variants } from 'motion/react';

import type { SwipeDirection } from '@/types/game';

/**
 * Shared Motion variants. Animations only describe *how things move* — they never decide
 * game rules or touch the score. Keep timings here so the feel can be tuned in one place.
 */

export const SPRING_SNAPPY: Transition = { type: 'spring', stiffness: 420, damping: 32 };

export const screenVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18, ease: 'easeIn' } },
};

const CARD_EXIT_DISTANCE_PX = 560;

/** `custom` = direction of the swipe that removed the card. */
export const cardVariants: Variants = {
  enter: { scale: 0.94, opacity: 0, y: 12 },
  center: { scale: 1, opacity: 1, y: 0, zIndex: 1, transition: SPRING_SNAPPY },
  exit: (direction: SwipeDirection | undefined) => ({
    x: direction === 'left' ? -CARD_EXIT_DISTANCE_PX : CARD_EXIT_DISTANCE_PX,
    rotate: direction === 'left' ? -18 : 18,
    opacity: 0,
    zIndex: 2,
    transition: { duration: 0.32, ease: 'easeIn' },
  }),
};

export const feedbackVariants: Variants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 18 } },
  exit: { opacity: 0, scale: 1.1, transition: { duration: 0.2 } },
};
