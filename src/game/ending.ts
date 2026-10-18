import { GAME_CONFIG } from '@/game/config';
import type { SessionSummary } from '@/types/game';

type RevenueConfig = (typeof GAME_CONFIG)['ending']['revenueEur'];

/** Total swipes in a session, in either direction. */
export function getTotalSwipes(
  summary: Pick<SessionSummary, 'rightSwipes' | 'leftSwipes'>,
): number {
  return summary.rightSwipes + summary.leftSwipes;
}

/**
 * The fictional revenue the company "made" from this session, shown in the ending reveal.
 * Every swipe is attention it can sell; every match keeps the player hooked a little longer.
 */
export function getSessionEarningsEur(
  summary: SessionSummary,
  revenue: RevenueConfig = GAME_CONFIG.ending.revenueEur,
): number {
  const matches = summary.normalMatches + summary.specialMatches + summary.negativeMatches;
  return getTotalSwipes(summary) * revenue.perSwipe + matches * revenue.perMatch;
}
