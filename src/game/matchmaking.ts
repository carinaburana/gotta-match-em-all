import { GAME_CONFIG } from '@/game/config';
import { getMatchCategory, getPointsForMatch } from '@/game/scoring';
import type { Candidate, CandidateKind, SwipeDirection, SwipeOutcome } from '@/types/game';

type ProbabilityConfig = Readonly<Record<CandidateKind, number>>;

/** The fictional "AI matchmaking". There is no real analysis — just configured probabilities. */

export function getReciprocationProbability(
  kind: CandidateKind,
  probabilities: ProbabilityConfig = GAME_CONFIG.reciprocationProbability,
): number {
  return probabilities[kind];
}

/** Does the candidate like the player back? Uses the roll stored on the candidate (pure). */
export function doesCandidateReciprocate(
  candidate: Pick<Candidate, 'kind' | 'reciprocationRoll'>,
  probabilities: ProbabilityConfig = GAME_CONFIG.reciprocationProbability,
): boolean {
  return candidate.reciprocationRoll < getReciprocationProbability(candidate.kind, probabilities);
}

/**
 * Resolves a swipe into an outcome. This is the single place where swipe rules live:
 * - left  → rejected, never affects the score
 * - right → match if the candidate reciprocates, otherwise nothing happens
 * Liking an unverified candidate is only penalised if they like you back.
 */
export function resolveSwipe(
  candidate: Candidate,
  direction: SwipeDirection,
  probabilities: ProbabilityConfig = GAME_CONFIG.reciprocationProbability,
): SwipeOutcome {
  if (direction === 'left') return { type: 'rejected' };
  if (!doesCandidateReciprocate(candidate, probabilities)) return { type: 'liked-no-match' };

  const category = getMatchCategory(candidate.kind);
  return { type: 'match', category, points: getPointsForMatch(category) };
}
