import type { InterestId } from '@/types/content';

/* -------------------------------------------------------------------------------------------------
 * Player
 * -----------------------------------------------------------------------------------------------*/

/** What the player creates during profile setup. Kept in memory only — never stored or sent. */
export interface PlayerProfile {
  name: string;
  /** Exactly `GAME_CONFIG.profile.requiredInterestCount` IDs. */
  interestIds: InterestId[];
  avatarId: string;
}

/* -------------------------------------------------------------------------------------------------
 * Candidates
 * -----------------------------------------------------------------------------------------------*/

/**
 * Hidden game category of a candidate. Decides the reward if a match happens.
 * - "normal":     verified, +10 on match
 * - "special":    verified, +100 on match (not necessarily more compatible!)
 * - "unverified": the "bad guys", −100 on match
 *
 * There is deliberately no "the-one" kind. THE ONE never appears — see docs/GAME_DESIGN.md.
 */
export type CandidateKind = 'normal' | 'special' | 'unverified';

export interface Candidate {
  /** Unique within one session, e.g. "cand-007". */
  id: string;
  name: string;
  age?: number;
  city: string;
  distanceKm: number;
  aboutMe: string;
  /** Interests shown on the card, in display order. */
  interestIds: InterestId[];
  portraitSrc: string;

  kind: CandidateKind;
  /** Always `kind !== 'unverified'`. Kept as its own field because the UI shows a badge for it. */
  isVerified: boolean;
  /**
   * Random number in [0, 1), rolled when the deck is built. A candidate reciprocates a like when
   * `reciprocationRoll < probability`. Pre-rolling keeps the game reducer pure and makes seeded
   * runs fully reproducible.
   */
  reciprocationRoll: number;
}

/* -------------------------------------------------------------------------------------------------
 * Swiping
 * -----------------------------------------------------------------------------------------------*/

export type SwipeDirection = 'left' | 'right';

/** Reward category of a formed match. */
export type MatchCategory = 'normal' | 'special' | 'negative';

export type SwipeOutcome =
  | { type: 'rejected' }
  | { type: 'liked-no-match' }
  | { type: 'match'; category: MatchCategory; points: number };

/** One resolved swipe, used for feedback overlays. `eventId` increases with every swipe. */
export interface SwipeEvent {
  eventId: number;
  candidateId: string;
  direction: SwipeDirection;
  outcome: SwipeOutcome;
}

/* -------------------------------------------------------------------------------------------------
 * Session
 * -----------------------------------------------------------------------------------------------*/

export type SessionStatus = 'ready' | 'playing' | 'finished';
export type SessionEndReason = 'time-up' | 'deck-exhausted';

export interface SessionStats {
  /** Cards that were on screen at some point (swiped cards + the card visible at the end). */
  cardsViewed: number;
  rightSwipes: number;
  leftSwipes: number;
  normalMatches: number;
  specialMatches: number;
  negativeMatches: number;
}

/** Aggregated result handed to the results screen. */
export interface SessionSummary extends SessionStats {
  finalScore: number;
  sessionDurationMs: number;
  endReason: SessionEndReason;
}
