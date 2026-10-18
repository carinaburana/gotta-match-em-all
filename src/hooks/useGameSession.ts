import { useCallback, useEffect, useReducer } from 'react';

import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import { generateDeck } from '@/game/deckGenerator';
import { createInitialGameState, gameReducer, getCurrentCandidate } from '@/game/gameReducer';
import { createRandomSeed, readSeedFromUrl } from '@/game/random';
import { useCountdown } from '@/hooks/useCountdown';
import type { PlayerProfile, SwipeDirection } from '@/types/game';

function resolveSeed(): number {
  return readSeedFromUrl() ?? GAME_CONFIG.randomSeed ?? createRandomSeed();
}

/**
 * Connects the pure game logic to React: builds the deck once, starts the session on mount,
 * runs the countdown, and exposes a single `swipe` action used by both gestures and buttons.
 */
export function useGameSession(player: PlayerProfile) {
  const [state, dispatch] = useReducer(gameReducer, player, (profile) =>
    createInitialGameState(
      generateDeck({
        seed: resolveSeed(),
        content: GAME_CONTENT,
        playerInterestIds: profile.interestIds,
      }),
    ),
  );

  // The timer starts when gameplay becomes visible — not during setup or the teaser.
  useEffect(() => {
    dispatch({ type: 'start', at: performance.now() });
  }, []);

  const remainingMs = useCountdown({
    startedAt: state.startedAt,
    durationMs: GAME_CONFIG.sessionDurationMs,
    isRunning: state.status === 'playing',
    onExpire: (at) => dispatch({ type: 'finish', reason: 'time-up', at }),
  });

  const swipe = useCallback((candidateId: string, direction: SwipeDirection) => {
    dispatch({ type: 'swipe', candidateId, direction, at: performance.now() });
  }, []);

  return {
    state,
    currentCandidate: getCurrentCandidate(state),
    remainingMs: state.status === 'finished' ? 0 : remainingMs,
    swipe,
  };
}
