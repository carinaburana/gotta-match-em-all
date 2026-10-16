import { AnimatePresence } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';

import { CandidateCard } from '@/components/cards/CandidateCard';
import { SwipeableCard } from '@/components/cards/SwipeableCard';
import { GameHud } from '@/components/game/GameHud';
import { MatchFeedbackOverlay, TimeUpOverlay } from '@/components/game/MatchFeedbackOverlay';
import { SwipeButtons } from '@/components/game/SwipeButtons';
import { GAME_CONFIG } from '@/game/config';
import { getSessionSummary } from '@/game/gameReducer';
import { useGameSession } from '@/hooks/useGameSession';
import { useKeyboardSwipe } from '@/hooks/useKeyboardSwipe';
import type { PlayerProfile, SessionSummary, SwipeDirection } from '@/types/game';

interface GameScreenProps {
  player: PlayerProfile;
  onFinished: (summary: SessionSummary) => void;
}

/**
 * Swipe gameplay. This screen only wires things together: rules live in src/game/,
 * session state in useGameSession, visuals in src/components/.
 */
export function GameScreen({ player, onFinished }: GameScreenProps) {
  const { state, currentCandidate, remainingMs, swipe } = useGameSession(player);
  const isPlaying = state.status === 'playing';

  // Buttons and keyboard swipe the card that is currently on top.
  const swipeCurrent = useCallback(
    (direction: SwipeDirection) => {
      if (currentCandidate) swipe(currentCandidate.id, direction);
    },
    [currentCandidate, swipe],
  );
  useKeyboardSwipe(swipeCurrent, isPlaying);

  // Hand the final numbers to the app exactly once, after a short "Time's up!" moment.
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    if (state.status !== 'finished') return;
    const summary = getSessionSummary(state);
    const timeoutId = window.setTimeout(
      () => onFinishedRef.current(summary),
      GAME_CONFIG.endScreenDelayMs,
    );
    return () => window.clearTimeout(timeoutId);
  }, [state]);

  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="relative min-h-0 flex-1 px-2 pt-2">
        <GameHud remainingMs={remainingMs} score={state.score} lastSwipe={state.lastSwipe} />

        <div className="relative h-full">
          <AnimatePresence initial={false} custom={state.lastSwipe?.direction}>
            {currentCandidate && (
              <SwipeableCard
                key={currentCandidate.id}
                candidateId={currentCandidate.id}
                onSwipe={swipe}
                disabled={!isPlaying}
              >
                <CandidateCard
                  candidate={currentCandidate}
                  playerInterestIds={player.interestIds}
                />
              </SwipeableCard>
            )}
          </AnimatePresence>
        </div>

        <MatchFeedbackOverlay lastSwipe={state.lastSwipe} />
      </div>

      <SwipeButtons onSwipe={swipeCurrent} disabled={!isPlaying} />

      <TimeUpOverlay
        show={state.status === 'finished'}
        label={state.endReason === 'deck-exhausted' ? 'No more aliens!' : 'Time’s up!'}
      />
    </div>
  );
}
