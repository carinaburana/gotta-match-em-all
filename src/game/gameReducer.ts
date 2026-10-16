import { resolveSwipe } from '@/game/matchmaking';
import { getScoreChange } from '@/game/scoring';
import type {
  Candidate,
  SessionEndReason,
  SessionStats,
  SessionStatus,
  SessionSummary,
  SwipeDirection,
  SwipeEvent,
} from '@/types/game';

/**
 * State of one swipe session. The reducer is the ONLY place where score and stats change.
 * It is pure: timestamps come in through actions and random rolls are pre-computed in the deck.
 */
export interface GameSessionState {
  status: SessionStatus;
  deck: Candidate[];
  currentIndex: number;
  score: number;
  stats: SessionStats;
  /** Most recent swipe, used for feedback overlays and card exit direction. */
  lastSwipe: SwipeEvent | null;
  startedAt: number | null;
  endedAt: number | null;
  endReason: SessionEndReason | null;
}

export type GameAction =
  | { type: 'start'; at: number }
  /** `candidateId` must match the current card — stale or duplicate swipes are ignored. */
  | { type: 'swipe'; candidateId: string; direction: SwipeDirection; at: number }
  | { type: 'finish'; reason: SessionEndReason; at: number };

const EMPTY_STATS: SessionStats = {
  cardsViewed: 0,
  rightSwipes: 0,
  leftSwipes: 0,
  normalMatches: 0,
  specialMatches: 0,
  negativeMatches: 0,
};

export function createInitialGameState(deck: Candidate[]): GameSessionState {
  return {
    status: 'ready',
    deck,
    currentIndex: 0,
    score: 0,
    stats: EMPTY_STATS,
    lastSwipe: null,
    startedAt: null,
    endedAt: null,
    endReason: null,
  };
}

export function getCurrentCandidate(state: GameSessionState): Candidate | null {
  return state.deck[state.currentIndex] ?? null;
}

function finish(state: GameSessionState, reason: SessionEndReason, at: number): GameSessionState {
  return { ...state, status: 'finished', endedAt: at, endReason: reason };
}

export function gameReducer(state: GameSessionState, action: GameAction): GameSessionState {
  switch (action.type) {
    case 'start': {
      if (state.status !== 'ready') return state;
      if (state.deck.length === 0) return finish(state, 'deck-exhausted', action.at);
      return {
        ...state,
        status: 'playing',
        startedAt: action.at,
        stats: { ...state.stats, cardsViewed: 1 },
      };
    }

    case 'swipe': {
      if (state.status !== 'playing') return state;
      const candidate = getCurrentCandidate(state);
      // Guard against double events (drag + button, animation callbacks, fast taps).
      if (!candidate || candidate.id !== action.candidateId) return state;

      const outcome = resolveSwipe(candidate, action.direction);
      const stats: SessionStats = { ...state.stats };
      if (action.direction === 'right') stats.rightSwipes += 1;
      else stats.leftSwipes += 1;
      if (outcome.type === 'match') {
        if (outcome.category === 'normal') stats.normalMatches += 1;
        if (outcome.category === 'special') stats.specialMatches += 1;
        if (outcome.category === 'negative') stats.negativeMatches += 1;
      }

      const nextIndex = state.currentIndex + 1;
      const hasNextCard = nextIndex < state.deck.length;
      if (hasNextCard) stats.cardsViewed += 1;

      const next: GameSessionState = {
        ...state,
        currentIndex: nextIndex,
        score: state.score + getScoreChange(outcome),
        stats,
        lastSwipe: {
          eventId: (state.lastSwipe?.eventId ?? 0) + 1,
          candidateId: candidate.id,
          direction: action.direction,
          outcome,
        },
      };
      return hasNextCard ? next : finish(next, 'deck-exhausted', action.at);
    }

    case 'finish': {
      if (state.status === 'finished') return state;
      return finish(state, action.reason, action.at);
    }
  }
}

/** Aggregated numbers for the results screen. Only meaningful once the session is finished. */
export function getSessionSummary(state: GameSessionState): SessionSummary {
  const duration =
    state.startedAt !== null && state.endedAt !== null ? state.endedAt - state.startedAt : 0;
  return {
    ...state.stats,
    finalScore: state.score,
    sessionDurationMs: Math.max(0, Math.round(duration)),
    endReason: state.endReason ?? 'time-up',
  };
}
