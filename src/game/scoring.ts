import { GAME_CONFIG } from '@/game/config';
import type { CandidateKind, MatchCategory, SwipeOutcome } from '@/types/game';

type PointsConfig = (typeof GAME_CONFIG)['points'];

/** Which reward category a match with this kind of candidate falls into. */
export function getMatchCategory(kind: CandidateKind): MatchCategory {
  switch (kind) {
    case 'normal':
      return 'normal';
    case 'special':
      return 'special';
    case 'unverified':
      return 'negative';
  }
}

export function getPointsForMatch(
  category: MatchCategory,
  points: PointsConfig = GAME_CONFIG.points,
): number {
  switch (category) {
    case 'normal':
      return points.normalMatch;
    case 'special':
      return points.specialMatch;
    case 'negative':
      return points.negativeMatch;
  }
}

/** Score change caused by a swipe outcome. Rejections and unanswered likes are worth 0. */
export function getScoreChange(outcome: SwipeOutcome): number {
  return outcome.type === 'match' ? outcome.points : 0;
}
