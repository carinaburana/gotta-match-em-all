import { GAME_CONFIG } from '@/game/config';
import type { SessionSummary, SwipeDirection } from '@/types/game';

/**
 * Pure helpers for the ending reveal. They only re-read the finished session — nothing here
 * changes game state, and there is still no THE ONE candidate: "queue position" is narrative.
 */

type SwipeCounts = Pick<SessionSummary, 'rightSwipes' | 'leftSwipes'>;

export function getTotalSwipes(summary: SwipeCounts): number {
  return summary.rightSwipes + summary.leftSwipes;
}

export function getTotalMatches(
  summary: Pick<SessionSummary, 'normalMatches' | 'specialMatches' | 'negativeMatches'>,
): number {
  return summary.normalMatches + summary.specialMatches + summary.negativeMatches;
}

/**
 * The swipes of a session as a short, evenly interleaved stream of directions, capped at
 * `maxCards` so the animation stays cheap. Keeps the real right/left ratio.
 */
export function buildSwipeStream(summary: SwipeCounts, maxCards: number): SwipeDirection[] {
  const total = getTotalSwipes(summary);
  const count = Math.min(total, Math.max(0, maxCards));
  if (count === 0) return [];

  const rights = Math.round((count * summary.rightSwipes) / total);
  return Array.from({ length: count }, (_, index) => {
    // Bresenham-style spreading: a right swipe whenever the running share crosses a whole number.
    const before = Math.floor((index * rights) / count);
    const after = Math.floor(((index + 1) * rights) / count);
    return after > before ? 'right' : 'left';
  });
}

export interface QueueNumbers {
  /** Queue number of the card the player would have seen next. */
  next: number;
  /** Where THE ONE "was kept": the very back of the deck. */
  theOne: number;
  /** Cards between the visible front of the queue and THE ONE. */
  hidden: number;
}

/** Queue numbers shown in the "queue" beat, derived from the deck size and cards viewed. */
export function getQueueNumbers(
  summary: Pick<SessionSummary, 'cardsViewed'>,
  visibleCards: number,
  deckSize: number = GAME_CONFIG.deck.size,
): QueueNumbers {
  const theOne = deckSize;
  // Even when the deck ran out, "next up" stays in front of THE ONE — that's the story.
  const next = Math.max(1, Math.min(summary.cardsViewed + 1, theOne - visibleCards));
  return { next, theOne, hidden: Math.max(0, theOne - next - visibleCards) };
}
