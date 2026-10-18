import { createCandidateGenerator } from '@/game/candidateGenerator';
import { GAME_CONFIG } from '@/game/config';
import { createRng, pickWeighted, shuffle } from '@/game/random';
import type { GameContent, InterestId } from '@/types/content';
import type { Candidate, CandidateKind } from '@/types/game';

export interface DeckOptions {
  seed: number;
  content: GameContent;
  playerInterestIds: readonly InterestId[];
  size?: number;
}

/**
 * Turns composition shares into exact card counts that add up to `size`.
 * Every kind with a share > 0 gets at least one card (if the deck is big enough).
 */
export function getDeckKindCounts(
  size: number,
  composition: Readonly<Record<CandidateKind, number>> = GAME_CONFIG.deck.composition,
): Record<CandidateKind, number> {
  const special = composition.special > 0 ? Math.max(1, Math.round(size * composition.special)) : 0;
  const unverified =
    composition.unverified > 0 ? Math.max(1, Math.round(size * composition.unverified)) : 0;
  const normal = Math.max(0, size - special - unverified);
  return { normal, special, unverified };
}

/**
 * Builds the full deck for one session. Call once when gameplay starts — never during render.
 * The same seed + same player interests always produce the same deck.
 *
 * There is no THE ONE in here, by design.
 */
export function generateDeck({
  seed,
  content,
  playerInterestIds,
  size = GAME_CONFIG.deck.size,
}: DeckOptions): Candidate[] {
  const rng = createRng(seed);
  const generateCandidate = createCandidateGenerator(rng, content, playerInterestIds);
  const counts = getDeckKindCounts(size);

  const kinds = shuffle(rng, [
    ...Array<CandidateKind>(counts.normal).fill('normal'),
    ...Array<CandidateKind>(counts.special).fill('special'),
    ...Array<CandidateKind>(counts.unverified).fill('unverified'),
  ]);

  const deck = kinds.map((kind, index) => {
    // 1. Roll the weighted random count from config
    let sharedCount = Number(pickWeighted(rng, GAME_CONFIG.candidate.sharedInterestWeights));

    // 2. Fix the bug: Cap at 2 so 3 shared interests remain completely exclusive to the One
    if (sharedCount >= 3) {
      sharedCount = 2;
    }

    return generateCandidate({
      id: `cand-${String(index + 1).padStart(3, '0')}`,
      kind,
      sharedInterestCount: sharedCount,
    });
  });

  if (new Set(deck.map((candidate) => candidate.id)).size !== deck.length) {
    throw new Error('generateDeck: duplicate candidate IDs');
  }

  return deck;
}
